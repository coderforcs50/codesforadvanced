import getpass

def log_input(prompt="Enter something: "):
    try:
        user_input = input(prompt)
        with open("key_log.txt", "a") as f:
            f.write(user_input + "\n")
        print("Input recorded in key_log.txt")
    except KeyboardInterrupt:
        print("\n[!] Input interrupted.")

def secret_password_entry():
    try:
        password = getpass.getpass("Enter secret (hidden): ")
        with open("key_log.txt", "a") as f:
            f.write("[SECRET] " + password + "\n")
        print("Password recorded (for demo only).")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("=== Simple Keylogger  ===")
    log_input()
    secret_password_entry()
