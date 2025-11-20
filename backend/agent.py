#!/usr/bin/env python3
"""
agent.py - Handwriting extraction agent (clean & simple)

- Uses Ollama as the primary model (local or tunneled)
- Works inside Docker when OLLAMA_HOST is set to host.docker.internal or an external URL
- Includes robust image preprocessing and error handling
- Returns structured JSON when possible, otherwise raw_text
"""

import os
import base64
import json
import io
import traceback
from typing import Dict, Any, Optional

import requests
from PIL import Image, ImageEnhance, ImageFilter

# ---- Configuration defaults ----
DEFAULT_OLLAMA_PORT = 11434
DEFAULT_OLLAMA_MODEL = "llava:latest"
DEFAULT_TIMEOUT_SECONDS = 120.0
DEFAULT_TEMPERATURE = 0.1
DEFAULT_NUM_PREDICT = 2048


class HandwritingExtractionAgent:
    def __init__(self) -> None:
        # Prefer explicit env var. If not set and running in Docker, host.docker.internal usually points to the host.
        env_host = os.getenv("OLLAMA_HOST")
        if env_host:
            self.ollama_host = env_host.rstrip("/")
        else:
            # fallback to host.docker.internal which is the recommended pattern for containers to reach host
            self.ollama_host = f"http://host.docker.internal:{DEFAULT_OLLAMA_PORT}"

        self.ollama_model = os.getenv("OLLAMA_MODEL", DEFAULT_OLLAMA_MODEL)
        self.request_timeout = float(os.getenv("OLLAMA_TIMEOUT_SECONDS", str(DEFAULT_TIMEOUT_SECONDS)))
        self.temperature = float(os.getenv("OLLAMA_TEMPERATURE", str(DEFAULT_TEMPERATURE)))
        self.num_predict = int(os.getenv("OLLAMA_NUM_PREDICT", str(DEFAULT_NUM_PREDICT)))
        self.enable_preprocessing = os.getenv("ENABLE_IMAGE_PREPROCESSING", "true").lower() == "true"

        # Basic startup logs
        print(f"[OK] Handwriting Extraction Agent initialized")
        print(f"[OK] Ollama configured (host={self.ollama_host}, model={self.ollama_model})")
        print(f"[OK] Preprocessing enabled: {self.enable_preprocessing}")

    # ---------------- Image preprocessing ----------------
    def preprocess_image(self, image_path: str) -> Image.Image:
        """Enhance image quality for better OCR accuracy"""
        img = Image.open(image_path)

        # Convert to RGB if needed
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Enhance contrast and sharpness
        img = ImageEnhance.Contrast(img).enhance(1.5)
        img = ImageEnhance.Sharpness(img).enhance(1.3)

        # Slight denoise
        img = img.filter(ImageFilter.MedianFilter(size=3))

        # Resize if too small (minimum 512px on longest side)
        width, height = img.size
        min_size = 512
        if max(width, height) < min_size:
            scale = min_size / max(width, height)
            new_width = int(width * scale)
            new_height = int(height * scale)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

        return img

    def encode_image(self, image_path: str) -> str:
        """Encode image to base64, with optional preprocessing"""
        if self.enable_preprocessing:
            try:
                img = self.preprocess_image(image_path)
                buffer = io.BytesIO()
                img.save(buffer, format="JPEG", quality=95)
                image_bytes = buffer.getvalue()
            except Exception as e:
                print(f"[WARNING] Image preprocessing failed, using original: {e}")
                with open(image_path, "rb") as f:
                    image_bytes = f.read()
        else:
            with open(image_path, "rb") as f:
                image_bytes = f.read()

        return base64.b64encode(image_bytes).decode("utf-8")

    # ---------------- Core extraction ----------------
    def extract_handwriting(self, image_path: str, filename: str) -> Dict[str, Any]:
        """
        Public method to extract handwriting. Returns dictionary with:
        {
          "success": bool,
          "filename": str,
          "extracted_data": {...} or {"raw_text": "..."},
          "message": str
        }
        """
        try:
            return self.extract_handwriting_ollama(image_path, filename)
        except Exception as e:
            print(f"[ERROR] Unhandled error in extract_handwriting: {e}")
            traceback.print_exc()
            return {
                "success": False,
                "filename": filename,
                "error": str(e),
                "message": "Unhandled error in handwriting extraction"
            }

    def extract_handwriting_ollama(self, image_path: str, filename: str) -> Dict[str, Any]:
        """Extract handwriting using the Ollama HTTP API"""
        try:
            # Prepare payload
            image_b64 = self.encode_image(image_path)

            prompt = (
                "You are an expert OCR system specialized in reading handwritten text with maximum accuracy.\n\n"
                "Analyze this handwritten document carefully and extract ALL visible information. "
                "Return ONLY valid JSON (no extra text). For illegible text use the string 'unreadable'.\n\n"
                "Return structured JSON with descriptive keys based on labels/headings present in the document."
            )

            payload = {
                "model": self.ollama_model,
                "prompt": prompt,
                "images": [image_b64],
                "stream": False,
                "options": {
                    "temperature": float(self.temperature),
                    "num_predict": int(self.num_predict),
                    "timeout": int(self.request_timeout),
                },
            }

            url = f"{self.ollama_host}/api/generate"
            # Debug log
            print(f"[DEBUG] Calling Ollama at: {url} (timeout={self.request_timeout}s)")

            response = requests.post(url, json=payload, timeout=self.request_timeout)
            # Raise for non-200
            if response.status_code != 200:
                print(f"[WARNING] Ollama request failed (status {response.status_code}): {response.text}")
                return {
                    "success": False,
                    "filename": filename,
                    "error": f"Ollama returned status {response.status_code}",
                    "message": "Ollama request failed"
                }

            result = response.json()
            # response may use key "response" or "generated" depending on Ollama version; handle gracefully
            extracted_text = ""
            if isinstance(result, dict):
                extracted_text = result.get("response") or result.get("generated") or result.get("output") or ""
            if not extracted_text and isinstance(result, list):
                # Some endpoints return list of events; try to stitch 'response' fields
                parts = []
                for item in result:
                    if isinstance(item, dict) and "response" in item:
                        parts.append(item["response"])
                extracted_text = "\n".join(parts)

            extracted_text = (extracted_text or "").strip()

            if not extracted_text:
                print(f"[WARNING] Ollama returned empty response: {result}")
                return {
                    "success": False,
                    "filename": filename,
                    "error": "Empty response from Ollama",
                    "message": "Ollama returned no text"
                }

            structured_data = self._parse_json_response(extracted_text)

            response_data = {
                "success": True,
                "filename": filename,
                "extracted_data": structured_data,
                "message": f"Handwriting extracted successfully using Ollama ({self.ollama_model})"
            }

            return response_data

        except requests.exceptions.RequestException as e:
            # Connection errors (host unreachable, refused, timed out)
            print(f"[ERROR] Ollama request exception: {e}")
            traceback.print_exc()
            return {
                "success": False,
                "filename": filename,
                "error": str(e),
                "message": "Failed to connect to Ollama. Ensure OLLAMA_HOST is reachable from the container."
            }
        except Exception as e:
            print(f"[ERROR] Ollama extraction failed: {e}")
            traceback.print_exc()
            return {
                "success": False,
                "filename": filename,
                "error": str(e),
                "message": "Unexpected error during Ollama extraction"
            }

    # ---------------- Helpers / Parsers ----------------
    def _parse_json_response(self, text: str) -> Dict[str, Any]:
        """Attempt to extract and parse JSON from a model response"""
        if not text:
            return {"raw_text": ""}

        extracted_text = text.strip()

        # Remove markdown code fences if present
        if extracted_text.startswith("```json"):
            extracted_text = extracted_text[len("```json"):].strip()
        if extracted_text.startswith("```"):
            extracted_text = extracted_text[3:].strip()
        if extracted_text.endswith("```"):
            extracted_text = extracted_text[:-3].strip()

        # Some LLMs return text with leading/trailing quotes or language markers; try to clean common wrappers
        # Remove single leading/trailing backticks or quotes
        if extracted_text.startswith("`") and extracted_text.endswith("`"):
            extracted_text = extracted_text[1:-1].strip()
        if extracted_text.startswith('"') and extracted_text.endswith('"'):
            # If it is a quoted JSON string, unquote once
            candidate = extracted_text[1:-1].strip()
            # Only accept unquoting if it looks like JSON
            if candidate.startswith("{") or candidate.startswith("["):
                extracted_text = candidate

        # Try parse
        try:
            parsed = json.loads(extracted_text)
            return parsed if isinstance(parsed, dict) else {"result": parsed}
        except json.JSONDecodeError:
            # Last effort: try to find first {...} portion inside text
            start = extracted_text.find("{")
            end = extracted_text.rfind("}")
            if start != -1 and end != -1 and end > start:
                candidate = extracted_text[start:end + 1]
                try:
                    parsed = json.loads(candidate)
                    return parsed if isinstance(parsed, dict) else {"result": parsed}
                except json.JSONDecodeError:
                    pass

            # Otherwise return raw_text for debugging and allow caller to handle it
            return {"raw_text": extracted_text}

    # Utility: test connectivity to Ollama host
    def health_check_ollama(self) -> Dict[str, Any]:
        """Simple check to test whether Ollama is reachable."""
        try:
            url = f"{self.ollama_host}/api/tags"
            resp = requests.get(url, timeout=10)
            return {"ok": resp.status_code == 200, "status_code": resp.status_code, "text": resp.text}
        except Exception as e:
            return {"ok": False, "error": str(e)}

# ---------------- CLI test runner ----------------
if __name__ == "__main__":
    import sys
    agent = HandwritingExtractionAgent()

    # If invoked with a path, run extraction and print JSON
    if len(sys.argv) >= 2:
        image_path = sys.argv[1]
        filename = os.path.basename(image_path)
        out = agent.extract_handwriting(image_path, filename)
        print(json.dumps(out, indent=2))
    else:
        print("Usage: python agent.py /path/to/image.jpg")
        print("Run health check to verify Ollama connectivity:")
        print(agent.health_check_ollama())
