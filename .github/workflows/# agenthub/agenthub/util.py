# agenthub/util.py
import os
import typing as _t

# Read API key & model from env
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")  # set in repo settings → Actions secrets
DEFAULT_MODEL = os.environ.get("LLM_MODEL", "gpt-4o-mini")

if not OPENAI_API_KEY:
    raise EnvironmentError("OPENAI_API_KEY is not set. Add it in: Settings → Secrets and variables → Actions.")

def llm(system_prompt: str, user_prompt: str = "", model: str = None, temperature: float = 0.3, max_tokens: int = 1500) -> str:
    """
    Calls OpenAI chat completions. Supports both new SDK (>=1.0) and old (<=0.28) as fallback.
    """
    mdl = model or DEFAULT_MODEL
    # Try the new SDK first
    try:
        from openai import OpenAI  # SDK v1+
        client = OpenAI(api_key=OPENAI_API_KEY)
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        if user_prompt:
            messages.append({"role": "user", "content": user_prompt})
        resp = client.chat.completions.create(
            model=mdl,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return resp.choices[0].message.content
    except Exception as e_new:
        # Fallback to legacy SDK if available
        try:
            import openai  # legacy
            openai.api_key = OPENAI_API_KEY
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            if user_prompt:
                messages.append({"role": "user", "content": user_prompt})
            resp = openai.ChatCompletion.create(
                model=mdl,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return resp["choices"][0]["message"]["content"]
        except Exception as e_old:
            # Surface the original new-SDK error first with context from old
            raise RuntimeError(f"OpenAI call failed. New-SDK error: {e_new}; Legacy fallback error: {e_old}")
