import os
from typing import List, Dict, Union
from datetime import datetime

# PDF
import fitz  # PyMuPDF
import pdfplumber

# DOCX
import docx

# HTML
from bs4 import BeautifulSoup

# TXT
import chardet

# LangChain & Unstructured (optional chunking)
from langchain.text_splitter import RecursiveCharacterTextSplitter

def extract_text_pdf(file_path: str) -> str:
    try:
        with pdfplumber.open(file_path) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)
    except Exception:
        doc = fitz.open(file_path)
        return "\n".join(page.get_text() for page in doc)

def extract_text_docx(file_path: str) -> str:
    doc = docx.Document(file_path)
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())

def extract_text_html(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
        return soup.get_text(separator="\n")

def extract_text_txt(file_path: str) -> str:
    with open(file_path, "rb") as f:
        raw = f.read()
        encoding = chardet.detect(raw)["encoding"]
    return raw.decode(encoding or "utf-8")

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=overlap)
    return splitter.split_text(text)

def ingest_documents(file_paths: List[str]) -> List[Dict[str, Union[str, Dict]]]:
    results = []

    for path in file_paths:
        ext = os.path.splitext(path)[1].lower()
        filename = os.path.basename(path)
        timestamp = datetime.fromtimestamp(os.path.getmtime(path)).isoformat()

        if ext == ".pdf":
            text = extract_text_pdf(path)
        elif ext == ".docx":
            text = extract_text_docx(path)
        elif ext in [".html", ".htm"]:
            text = extract_text_html(path)
        elif ext == ".txt":
            text = extract_text_txt(path)
        else:
            print(f"Unsupported file type: {ext}")
            continue

        chunks = chunk_text(text)
        for i, chunk in enumerate(chunks):
            results.append({
                "text": chunk,
                "metadata": {
                    "filename": filename,
                    "section": f"chunk_{i}",
                    "timestamp": timestamp
                }
            })

    return results
