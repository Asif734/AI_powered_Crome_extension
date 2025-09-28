FROM python:3.11-slim-buster
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "5000"]