import os
import requests


def send_email(to: str, subject: str, body: str):
    api_key = os.getenv("RESEND_API_KEY")

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "from": "onboarding@resend.dev",
            "to": [to],
            "subject": subject,
            "html": f"""
            <div style="font-family: Arial, sans-serif;">
                <h2>{subject}</h2>
                <p>{body}</p>
            </div>
            """,
        },
    )

    print("Status Code:", response.status_code)
    print("Response:", response.text)

    if response.status_code not in [200, 201]:
        raise Exception(
            f"Failed to send email: {response.text}"
        )
