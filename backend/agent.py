#!/usr/bin/env python3
"""
agent.py - Handwriting extraction using remote Ollama (tunnel or internet)

- EC2 backend communicates with Ollama running on your LOCAL MACHINE
- OLLAMA_HOST must be set (example: https://abc123.trycloudflare.com)
- Preprocessing and JSON clean parsing included
"""

import os
import base64
import json
import io
import traceback
from typing import Dict, Any

import requests
from PIL import Image, ImageEnhance, ImageFilter


# Defaults
DEFAULT_OLLAMA_MODEL = "llava:latest"
DEFAULT_TIMEOUT_SECONDS = 120
DEFAULT_TEMPERATURE = 0.1
DEFAULT_NUM_PREDICT = 2048


class HandwritingExtractionAgent:
    def __init__(self) -> None:
        # --------------------------------------
        # REQUIRE OLLAMA_HOST
        # --------------------------------------
        env_host = os.getenv("OLLAMA_HOST")

        if not env_host:
            raise ValueError(
                "OLLAMA_HOST is not set! For EC2, you MUST set a public/tunnel URL.\n"
                "Example: export OLLAMA_HOST=https://abc123.trycloudflare.com"
            )

        self.ollama_host = env_host.rstrip("/")

        # Other configs
        self.ollama_model = os.getenv("OLLAMA_MODEL", DEFAULT_OLLAMA_MODEL)
        self.request_timeout = float(os.getenv("OLLAMA_TIMEOUT_SECONDS", DEFAULT_TIMEOUT_SECONDS))
        self.temperature = float(os.getenv("OLLAMA_TEMPERATURE", DEFAULT_TEMPERATURE))
        self.num_predict = int(os.getenv("OLLAMA_NUM_PREDICT", DEFAULT_NUM_PREDICT))
        self.enable_preprocessing = os.getenv("ENABLE_IMAGE_PREPROCESSING", "true").lower() == "true"

        print(f"[OK] Handwriting Agent initialized")
        print(f"[OK] Using remote Ollama: {self.ollama_host}")
        print(f"[OK] Model: {self.ollama_model}")
        print(f"[OK] Preprocessing enabled: {self.enable_preprocessing}")

    # -------------------------------------------------------
    # IMAGE PREPROCESSING
    # -------------------------------------------------------
    def preprocess_image(self, image_path: str) -> Image.Image:
        img = Image.open(image_path)

        if img.mode != "RGB":
            img = img.convert("RGB")

        img = ImageEnhance.Contrast(img).enhance(1.5)
        img = ImageEnhance.Sharpness(img).enhance(1.3)
        img = img.filter(ImageFilter.MedianFilter(3))

        w, h = img.size
        if max(w, h) < 512:
            scale = 512 / max(w, h)
            img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

        return img

    def encode_image(self, image_path: str) -> str:
        try:
            if self.enable_preprocessing:
                img = self.preprocess_image(image_path)
                buf = io.BytesIO()
                img.save(buf, format="JPEG", quality=95)
                data = buf.getvalue()
            else:
                with open(image_path, "rb") as f:
                    data = f.read()
        except:
            with open(image_path, "rb") as f:
                data = f.read()

        return base64.b64encode(data).decode()

    # -------------------------------------------------------
    # MAIN EXTRACTION
    # -------------------------------------------------------
    def extract_handwriting(self, image_path: str, filename: str) -> Dict[str, Any]:
        try:
            return self._extract_with_ollama(image_path, filename)
        except Exception as e:
            traceback.print_exc()
            return {
                "success": False,
                "filename": filename,
                "error": str(e),
                "message": "Unhandled error in handwriting extraction"
            }

    def _extract_with_ollama(self, image_path: str, filename: str) -> Dict[str, Any]:
        try:
            image_b64 = self.encode_image(image_path)

            prompt = (
                "You are an expert OCR system specialized in reading handwritten text.\n"
                "Extract ALL readable content and return STRICT JSON only.\n"
                "If text is unreadable, use \"unreadable\".\n"
            )

            payload = {
                "model": self.ollama_model,
                "prompt": prompt,
                "images": [image_b64],
                "stream": False,
                "options": {
                    "temperature": self.temperature,
                    "num_predict": self.num_predict
                }
            }

            url = f"{self.ollama_host}/api/generate"
            print(f"[DEBUG] Sending request → {url}")

            response = requests.post(url, json=payload, timeout=self.request_timeout)

            if response.status_code != 200:
                print(f"[ERROR] Ollama failed ({response.status_code}): {response.text}")
                return {
                    "success": False,
                    "filename": filename,
                    "error": response.text,
                    "message": "Ollama returned an error"
                }

            result = response.json()

            extracted_text = (
                result.get("response")
                or result.get("generated")
                or result.get("output")
                or ""
            ).strip()

            if not extracted_text:
                print("[ERROR] Empty response from Ollama")
                return {"success": False, "filename": filename, "error": "Empty response"}

            structured = self._parse_json(extracted_text)

            return {
                "success": True,
                "filename": filename,
                "extracted_data": structured,
                "message": "Handwriting extracted successfully"
            }

        except requests.exceptions.RequestException as e:
            print(f"[ERROR] Cannot reach Ollama: {e}")
            return {
                "success": False,
                "filename": filename,
                "error": str(e),
                "message": "Ollama is unreachable — check tunnel and OLLAMA_HOST"
            }

    # -------------------------------------------------------
    # JSON PARSER
    # -------------------------------------------------------
    def _parse_json(self, text: str) -> Dict[str, Any]:
        cleaned = text.strip()

        # Remove code fences
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`").strip()

        # Try direct JSON
        try:
            return json.loads(cleaned)
        except:
            pass

        # Try extracting {...}
        try:
            start = cleaned.find("{")
            end = cleaned.rfind("}")
            if start != -1 and end != -1:
                return json.loads(cleaned[start:end + 1])
        except:
            pass

        return {"raw_text": text}

    # -------------------------------------------------------
    # Health check
    # -------------------------------------------------------
    def health_check_ollama(self) -> Dict[str, Any]:
        try:
            url = f"{self.ollama_host}/api/tags"
            resp = requests.get(url, timeout=10)
            return {"ok": resp.status_code == 200, "status": resp.status_code, "text": resp.text}
        except Exception as e:
            return {"ok": False, "error": str(e)}


if __name__ == "__main__":
    import sys

    agent = HandwritingExtractionAgent()

    if len(sys.argv) >= 2:
        path = sys.argv[1]
        name = os.path.basename(path)
        out = agent.extract_handwriting(path, name)
        print(json.dumps(out, indent=2))
    else:
        print("Usage: python agent.py /path/to/image.jpg")
        print(agent.health_check_ollama())
