import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to: str, subject: str, body: str):
    try:
        sender_email = "saj06224@gmail.com"
        sender_password = "hmie xnek qjli bfgp"

        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = to
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        print("Connecting to SMTP...")
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        print("Logging into Gmail...")
        server.login(sender_email, sender_password)

        print("Sending email...")
        server.sendmail(sender_email, to, msg.as_string())

        server.quit()
        print("Email sent successfully")

    except Exception as e:
        print("SMTP Error:", e)
        raise