# XMLBackend\agentGui.py
import os
import requests
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from lxml import etree

class XMLAgentGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("XML Validator Agent v1.0")
        self.root.geometry("500x450")
        self.token = None
        self.api_base_url = "http://127.0.0.1:8000" # Update this to your production URL

        # UI Styling
        self.style = ttk.Style()
        self.style.configure("TButton", padding=6)
        self.style.configure("TLabel", font=("Segoe UI", 10))

        self.setup_login_screen()

    def setup_login_screen(self):
        self.clear_screen()
        
        tk.Label(self.root, text="Agent Login", font=("Segoe UI", 16, "bold")).pack(pady=20)
        
        tk.Label(self.root, text="Username:").pack(pady=5)
        self.username_entry = ttk.Entry(self.root, width=30)
        self.username_entry.pack()

        tk.Label(self.root, text="Password:").pack(pady=5)
        self.password_entry = ttk.Entry(self.root, width=30, show="*")
        self.password_entry.pack()

        ttk.Button(self.root, text="Login", command=self.handle_login).pack(pady=20)

    def setup_main_screen(self):
        self.clear_screen()
        
        tk.Label(self.root, text="Step 2: Select & Submit", font=("Segoe UI", 14, "bold")).pack(pady=20)
        
        self.folder_label = tk.Label(self.root, text="No folder selected", fg="gray")
        self.folder_label.pack(pady=10)

        ttk.Button(self.root, text="Browse Folder", command=self.browse_folder).pack(pady=5)
        
        self.submit_btn = ttk.Button(self.root, text="Run Validation & Sync", command=self.run_process, state="disabled")
        self.submit_btn.pack(pady=30)

        self.progress = ttk.Progressbar(self.root, orient="horizontal", length=300, mode="determinate")
        self.progress.pack(pady=10)

    def handle_login(self):
        username = self.username_entry.get()
        password = self.password_entry.get()

        try:
            # Matches your existing login endpoint
            response = requests.post(f"{self.api_base_url}/api/v1/users/login", 
                                  json={"username": username, "password": password})
            
            if response.status_code == 200:
                # Based on your previous API structure, token is in data.access_token
                res_data = response.json()
                self.token = res_data.get("data", {}).get("access_token")
                messagebox.showinfo("Success", "Authenticated successfully!")
                self.setup_main_screen()
            else:
                messagebox.showerror("Login Failed", "Invalid credentials")
        except Exception as e:
            messagebox.showerror("Error", f"Could not connect to server: {e}")

    def browse_folder(self):
        folder = filedialog.askdirectory()
        if folder:
            self.folder_path = folder
            self.folder_label.config(text=f"Selected: {os.path.basename(folder)}", fg="black")
            self.submit_btn.config(state="normal")

    def run_process(self):
        files = [f for f in os.listdir(self.folder_path) if f.endswith(".xml")]
        if not files:
            messagebox.showwarning("Empty", "No XML files found in this folder.")
            return

        self.progress["maximum"] = len(files)
        results = []

        for i, file_name in enumerate(files):
            full_path = os.path.join(self.folder_path, file_name)
            with open(full_path, "rb") as f:
                content = f.read()
                is_valid, error = self.validate_xml(content)
                results.append({"file_name": file_name, "is_valid": is_valid, "error": error})
            
            self.progress["value"] = i + 1
            self.root.update_idletasks()

        self.sync_to_server(results)

    def validate_xml(self, content):
        parser = etree.XMLParser(recover=False, resolve_entities=False)
        try:
            etree.fromstring(content, parser)
            return True, "None"
        except etree.XMLSyntaxError:
            errors = [f"Line {e.line}: {e.message}" for e in parser.error_log]
            return False, " | ".join(errors)
        except:
            return False, "Unknown Error"

    def sync_to_server(self, results):
        headers = {"Authorization": f"Bearer {self.token}"}
        try:
            resp = requests.post(f"{self.api_base_url}/api/v1/Agent/bulk-results", 
                               json={"results": results}, headers=headers)
            if resp.status_code == 200:
                messagebox.showinfo("Success", f"Synced {len(results)} reports to server!")
                self.progress["value"] = 0
            else:
                messagebox.showerror("Sync Error", resp.text)
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def clear_screen(self):
        for widget in self.root.winfo_children():
            widget.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    app = XMLAgentGUI(root)
    root.mainloop()