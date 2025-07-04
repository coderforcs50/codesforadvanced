print(" Welcome to simple cyber things - Choose a tool:")

print("""
1. Port Scanner (local)
2. Password Tester
3. Exit
""")

choice = input("Enter your choice (1/2/3): ")

if choice == "1":
    print("🔍 Scanning ports 20 to 30 on localhost...")
    import socket
    for port in range(20, 31):
        s = socket.socket()
        s.settimeout(0.1)
        try:
            s.connect(("127.0.0.1", port))
            print(f"✅ Port {port} is open")
            s.close()
        except:
            pass

elif choice == "2":
    print("🔐 Testing password against a fake login...")
    password = input("Enter password to test: ")
    if password == "letmein":
        print("✅ Access granted.")
    else:
        print("❌ Access denied.")

elif choice == "3":
    print("👋 Bye!")
else:
    print("❗ Invalid choice.")
