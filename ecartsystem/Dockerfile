FROM python:3.11-slim

WORKDIR /app

COPY requirement.txt .

RUN pip install --no-cache-dir -r requirement.txt

COPY . .

RUN chmod +x app/start.sh

EXPOSE 8000

CMD ["/app/app/start.sh"]