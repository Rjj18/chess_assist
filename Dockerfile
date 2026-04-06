FROM python:3.11-slim

# Evita que o Python grave arquivos .pyc
ENV PYTHONDONTWRITEBYTECODE=1
# Garante que os logs de saída sejam exibidos em tempo real no console
ENV PYTHONUNBUFFERED=1

WORKDIR /src

# Copia os requirements primeiro para otimizar o cache de build do Docker
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do repositório para dentro do container
COPY . .

# Porta padrão exposta do FastAPI
EXPOSE 8000

# Executa o servidor ASGI (Uvicorn), chamando a instância "app" no arquivo app/main.py
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
