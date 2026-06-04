🩸 Smart Blood Donor Emergency Management System
📌 Project Overview

The Smart Blood Donor Emergency Management System is a data structure-based web application designed to efficiently manage blood donor information and support hospitals during emergency blood requirements.

In real-world situations, hospitals need to quickly find suitable blood donors during emergencies such as accidents, surgeries, and disasters. Manual searching is slow and inefficient. This system solves that problem using efficient data structures such as AVL Tree, Doubly Linked List, and Heap (Priority Queue).

The system provides fast donor searching, structured donation history management, and priority-based emergency blood request handling.

🎯 Key Features
👤 Donor Management
Register new donors
Update donor information
Delete donor records
Search donors by ID, blood group, and district
🔍 Smart Search System
Fast donor search using AVL Tree
Filter donors by:
Blood group
District
Availability
🩸 Donation History Management
Add donation records for each donor
View donation history (oldest → newest)
Reverse traversal (newest → oldest)
Delete incorrect donation records
🚨 Emergency Blood Request System
Add emergency requests
Priority-based request handling using Heap
Critical cases handled first
📊 Analytics Dashboard
Total number of donors
Available donors
Blood group distribution
Emergency request statistics
🧠 Data Structures Used
🌳 AVL Tree (Main Data Structure)

Used for storing donor records.

Ensures balanced tree structure
Fast operations:
Search: O(log n)
Insert: O(log n)
Delete: O(log n)

Why AVL Tree?
To ensure fast searching and efficient handling of large donor datasets without performance degradation.

🔗 Doubly Linked List (Donation History)

Used to store donation history for each donor.

Supports forward and backward traversal
Efficient insertion and deletion

Why Doubly Linked List?
To manage multiple donation records per donor and allow easy navigation through history.

🏗 Heap (Priority Queue)

Used for managing emergency blood requests.

Highest priority requests are processed first
Efficient insertion and deletion: O(log n)

Why Heap?
To ensure critical emergency cases are handled before normal requests.

🏗 System Architecture
                AVL TREE (Donor Database)
                        │
        ┌───────────────┼───────────────┐
        │                               │
Search / Filter                 Donor Management
        │                               │
        ▼                               ▼
Doubly Linked List             Heap (Emergency Requests)
(Donation History)            (Priority Handling)
        │                               │
        └────────────── Dashboard / UI ─┘
⚙️ Functional Workflow
User registers donor → Stored in AVL Tree
User searches donor → AVL Tree search
Donation added → Stored in Doubly Linked List
Emergency request → Added to Heap
System matches donors based on availability and filters
Results displayed on dashboard
⏱ Time Complexity Analysis
Operation	Data Structure	Complexity
Search Donor	AVL Tree	O(log n)
Insert Donor	AVL Tree	O(log n)
Delete Donor	AVL Tree	O(log n)
Add Donation	Doubly Linked List	O(1)
View History	Doubly Linked List	O(n)
Emergency Handling	Heap	O(log n)
💡 Novel Features
Emergency priority-based donor matching system
Donor eligibility checking system
Blood demand analytics dashboard
Efficient multi-data structure integration
🛠 Technologies Used
C++ (Core Implementation)
HTML, Tailwind CSS, JavaScript (Frontend UI)
Crow Framework (if web backend used)
Git & GitHub (Version Control)
🚀 How to Run the Project
Backend (C++)
Compile C++ files:
g++ main.cpp -o app
Run executable:
./app
Web Interface (if included)
Open index.html in browser
OR
Run backend server and connect via localhost
📌 Project Objective

To design and implement an efficient blood donor management system using advanced data structures that improve speed, organization, and emergency response efficiency in real-world healthcare scenarios.

👨‍💻 Author

Name: Your Name
Institute: National Institute of Business Management (NIBM)
Course: Higher National Diploma in Software Engineering

📄 License

This project is developed for academic purposes.

🏁 Conclusion

This system demonstrates the practical application of AVL Trees, Doubly Linked Lists, and Heap data structures in solving real-world healthcare problems. It improves donor search efficiency, maintains structured donation history, and ensures priority-based emergency handling.
