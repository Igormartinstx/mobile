import json
import os
from langchain_ollama import OllamaLLM
from dotenv import load_dotenv

load_dotenv()

JSON_PATH = "data/brasileirao_2025.json"
MODEL_NAME = "phi3:mini"  # leve e eficiente


# ---------------------- #
# Carregar o banco JSON
# ---------------------- #
def load_data():
    if not os.path.exists(JSON_PATH):
        raise FileNotFoundError(f"Arquivo não encontrado: {JSON_PATH}")
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


DATA = load_data()


# ---------------------- #
# Função para buscar contexto
# ---------------------- #
def search_context(question: str) -> str:
    question = question.lower()

    # 1) Perguntas sobre o líder
    if "lider" in question or "líder" in question or "primeiro" in question:
        leader = DATA["tabela"][0]
        return f"O líder atual é o {leader['team']} com {leader['pts']} pontos."

    # 2) Perguntas sobre artilharia
    if "artilheiro" in question or "gols" in question:
        top = DATA["artilharia"][0]
        return f"O artilheiro é {top['player']} do {top['team']} com {top['goals']} gols."

    # 3) Perguntas sobre assistências
    if "assist" in question:
        top = DATA["assists"][0]
        return f"O líder de assistências é {top['player']} do {top['team']} com {top['assists']} assistências."

    # 4) Perguntas sobre um time específico
    for team_data in DATA["tabela"]:
        if team_data["team"].lower() in question:
            return f"""
Informações sobre {team_data['team']}:
Pontos: {team_data['pts']}
Gols Pró: {team_data['gf']}
Gols Sofridos: {team_data['ga']}
Saldo: {team_data['gd']}
Artilheiro: {team_data['top_scorer']}
"""

    # 5) fallback: contexto geral (pesquisa simples texto bruto)
    combined_text = json.dumps(DATA, ensure_ascii=False)
    if any(word in combined_text.lower() for word in question.split()):
        return "Informação encontrada nos dados, mas não identificada por regra específica."

    return "Nenhuma informação correspondente encontrada no banco."


# ---------------------- #
# Gerador final (modelo)
# ---------------------- #
def ask(question: str):
    context = search_context(question)

    prompt = f"""
Você é um assistente especializado no Brasileirão 2025.
Responda SOMENTE com base no contexto abaixo:

CONTEXT:
{context}

PERGUNTA:
{question}

RESPOSTA:
"""

    llm = OllamaLLM(model=MODEL_NAME)
    return llm.invoke(prompt)


# ---------------------- #
# Execução CLI
# ---------------------- #
if __name__ == "__main__":
    print("Pergunta sobre o Brasileirão 2025:")
    q = input("> ").strip()

    print("\nResposta:\n")
    print(ask(q))
