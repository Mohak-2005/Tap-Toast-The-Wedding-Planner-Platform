# Authoritative Seed Data and State Logic for Tap & Toast
import json

SEED_STATE = {
    "version": 2,
    "currentWeddingId": "w1",
    "weddings": [
        {
            "id": "w1",
            "couple": "Sophie & James",
            "partner1": "Sophie",
            "partner2": "James",
            "date": "2026-11-14T14:00:00",
            "dateDisplay": "14 Nov 2026",
            "timeDisplay": "2:00 PM",
            "venue": "Fernwood Estate, Southern Highlands",
            "venueAddress": "124 Range Road, Mittagong NSW 2575",
            "parking": "Complimentary on-site guest parking is available at the Main Lawn entrance. Follow the directional signs upon arrival.",
            "dressCode": "Black Tie Optional / Formal Elegance",
            "registry": "Digital wishing well via Gift & Go",
            "invited": 118,
            "status": "Finalising",
            "tasks": [
                {"id": "t1", "text": "Send save-the-dates", "completed": True, "due": ""},
                {"id": "t2", "text": "Finalise table 9 & 10 seating", "completed": False, "due": "Due Fri"},
                {"id": "t3", "text": "Send RSVP reminder to 22 guests", "completed": False, "due": "Due Mon"}
            ],
            "runSheet": [
                {"id": "rs1", "time": "13:30", "note": "MC arrival, audio check with AV tech & Celebrant Sarah", "done": False},
                {"id": "rs2", "time": "14:00", "note": "Guest seating & ceremony processional commences", "done": False},
                {"id": "rs3", "time": "14:45", "note": "Announce cocktail hour, direct guests to Verandah for canapés & bar", "done": False},
                {"id": "rs4", "time": "15:45", "note": "Sound dinner bell, usher guests into Grand Pavilion", "done": False},
                {"id": "rs5", "time": "16:00", "note": "Grand Entrance introduction for bridal party & Sophie & James", "done": False},
                {"id": "rs6", "time": "16:15", "note": "Welcome remarks & housekeeping, introduce entrée service", "done": False},
                {"id": "rs7", "time": "17:30", "note": "Call for main speeches: Father of the Bride, Maid of Honour, Best Man", "done": False},
                {"id": "rs8", "time": "19:15", "note": "Invite couple for Cake Cutting, direct guests to Dance Floor for First Dance", "done": False},
                {"id": "rs9", "time": "22:15", "note": "Last drinks call & organise guests with sparklers for courtyard send-off", "done": False}
            ]
        },
        {
            "id": "w2",
            "couple": "Aisha & Marcus",
            "partner1": "Aisha",
            "partner2": "Marcus",
            "date": "2027-05-02T15:00:00",
            "dateDisplay": "2 May 2027",
            "timeDisplay": "3:00 PM",
            "venue": "Doltone House, Sydney",
            "venueAddress": "Jones Bay Wharf, Pyrmont NSW",
            "parking": "Valet parking available at Jones Bay Wharf.",
            "dressCode": "Cocktail Attire",
            "registry": "Gift & Go wishing well",
            "invited": 86,
            "confirmed": 46,
            "status": "On track",
            "tasks": [
                {"id": "t21", "text": "Book floral designer", "completed": True, "due": ""},
                {"id": "t22", "text": "Send digital invitations", "completed": True, "due": ""},
                {"id": "t23", "text": "Taste menu options", "completed": False, "due": "Due next month"}
            ],
            "runSheet": [
                {"id": "rs21", "time": "14:30", "note": "MC setup & audio check", "done": False},
                {"id": "rs22", "time": "15:00", "note": "Ceremony begins", "done": False}
            ]
        },
        {
            "id": "w3",
            "couple": "Emma & Tom",
            "partner1": "Emma",
            "partner2": "Tom",
            "date": "2027-06-20T14:30:00",
            "dateDisplay": "20 Jun 2027",
            "timeDisplay": "2:30 PM",
            "venue": "Dunbar House, Watsons Bay",
            "venueAddress": "9 Marine Parade, Watsons Bay NSW",
            "parking": "Robertson Park street parking and Watsons Bay ferry wharf.",
            "dressCode": "Lounge Suit / Garden Formal",
            "registry": "Gift & Go wishing well",
            "invited": 140,
            "confirmed": 31,
            "status": "Planning",
            "tasks": [
                {"id": "t31", "text": "Confirm celebrant", "completed": True, "due": ""},
                {"id": "t32", "text": "Draft guest list", "completed": False, "due": "Due next week"}
            ],
            "runSheet": [
                {"id": "rs31", "time": "14:00", "note": "Guest arrival at Dunbar lawn", "done": False}
            ]
        },
        {
            "id": "w4",
            "couple": "Katie & Rob",
            "partner1": "Katie",
            "partner2": "Rob",
            "date": "2027-07-11T15:00:00",
            "dateDisplay": "11 Jul 2027",
            "timeDisplay": "3:00 PM",
            "venue": "Dunbar House, Watsons Bay",
            "venueAddress": "9 Marine Parade, Watsons Bay NSW",
            "parking": "Dunbar House dedicated parking bays.",
            "dressCode": "Black Tie",
            "registry": "Gift & Go wishing well",
            "invited": 95,
            "confirmed": 9,
            "status": "Planning",
            "tasks": [
                {"id": "t41", "text": "Lock in photographer", "completed": False, "due": "Due in 2 weeks"}
            ],
            "runSheet": [
                {"id": "rs41", "time": "14:30", "note": "Prelude music starts", "done": False}
            ]
        }
    ],
    "tables": [
        {"id": "head", "name": "HEAD TABLE", "capacity": 8, "isHead": True},
        {"id": "table_1", "name": "Table 1", "capacity": 8, "isHead": False},
        {"id": "table_2", "name": "Table 2", "capacity": 8, "isHead": False},
        {"id": "table_3", "name": "Table 3", "capacity": 8, "isHead": False},
        {"id": "table_4", "name": "Table 4", "capacity": 8, "isHead": False},
        {"id": "table_5", "name": "Table 5", "capacity": 8, "isHead": False},
        {"id": "table_6", "name": "Table 6", "capacity": 8, "isHead": False}
    ],
    # Seed guests: 118 invited, 96 confirmed, 9 declined, 22 awaiting.
    # Seated: Head Table (8), Table 1 (8), Table 2 (6), Table 3 (4), Table 4 (8), Table 5 (3), Table 6 (0)
    # Unassigned: 14 guests
    "guests": [
        # Priya Sharma (Default guest: Table 4, Seat 3)
        {"id": "priya", "name": "Priya Sharma", "initials": "PS", "household": "The Sharma Family", "email": "priya.sharma@example.com.au", "phone": "0412 884 992", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "Vegetarian", "song": "September - Earth, Wind & Fire", "reminderSent": False, "tableId": "table_4", "seatIndex": 3},
        
        # Head Table (8 seats)
        {"id": "g_ht1", "name": "Sophie Bell", "initials": "SB", "household": "Sophie Bell", "email": "sophie.bell@example.com", "phone": "0400 111 222", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "At Last - Etta James", "reminderSent": False, "tableId": "head", "seatIndex": 0},
        {"id": "g_ht2", "name": "James Gordon", "initials": "JG", "household": "James Gordon", "email": "james.gordon@example.com", "phone": "0400 222 333", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "You Are The Best Thing", "reminderSent": False, "tableId": "head", "seatIndex": 1},
        {"id": "g_ht3", "name": "Hannah Martin", "initials": "HM", "household": "Hannah Martin", "email": "hannah.m@example.com", "phone": "0400 333 444", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Vegetarian", "song": "Dancing Queen", "reminderSent": False, "tableId": "head", "seatIndex": 2},
        {"id": "g_ht4", "name": "Oliver Vance", "initials": "OV", "household": "Oliver Vance", "email": "oliver.v@example.com", "phone": "0400 444 555", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Mr. Brightside", "reminderSent": False, "tableId": "head", "seatIndex": 3},
        {"id": "g_ht5", "name": "Charlotte Evans", "initials": "CE", "household": "Charlotte Evans", "email": "charlotte.e@example.com", "phone": "0400 555 666", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Gluten-free", "song": "Levitating", "reminderSent": False, "tableId": "head", "seatIndex": 4},
        {"id": "g_ht6", "name": "Liam Fletcher", "initials": "LF", "household": "Liam Fletcher", "email": "liam.f@example.com", "phone": "0400 666 777", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Uptown Funk", "reminderSent": False, "tableId": "head", "seatIndex": 5},
        {"id": "g_ht7", "name": "Grace Kelly", "initials": "GK", "household": "Grace Kelly", "email": "grace.k@example.com", "phone": "0400 777 888", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "I Wanna Dance with Somebody", "reminderSent": False, "tableId": "head", "seatIndex": 6},
        {"id": "g_ht8", "name": "Alexander Wright", "initials": "AW", "household": "Alexander Wright", "email": "alex.w@example.com", "phone": "0400 888 999", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Superstition", "reminderSent": False, "tableId": "head", "seatIndex": 7},

        # Table 1 (8 seated: MK, DV, JW, AC, RK, LP, EL, CJ)
        {"id": "g_t1_1", "name": "Michael Chen", "initials": "MC", "household": "Michael Chen", "email": "michael.chen@example.com", "phone": "0411 223 901", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "Vegetarian", "song": "Stayin' Alive", "reminderSent": False, "tableId": "table_1", "seatIndex": 0},
        {"id": "g_t1_2", "name": "David Vance", "initials": "DV", "household": "David Vance", "email": "david.vance@example.com", "phone": "0411 223 902", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Don't Stop Me Now", "reminderSent": False, "tableId": "table_1", "seatIndex": 1},
        {"id": "g_t1_3", "name": "Jessica White", "initials": "JW", "household": "Jessica White", "email": "jessica.white@example.com", "phone": "0411 223 903", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Blinding Lights", "reminderSent": False, "tableId": "table_1", "seatIndex": 2},
        {"id": "g_t1_4", "name": "Aunty Carol Evans", "initials": "AC", "household": "Aunty Carol", "email": "carol.evans@example.com", "phone": "0411 223 904", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Sweet Caroline", "reminderSent": False, "tableId": "table_1", "seatIndex": 3},
        {"id": "g_t1_5", "name": "Robert King", "initials": "RK", "household": "Robert King", "email": "robert.king@example.com", "phone": "0411 223 905", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Billie Jean", "reminderSent": False, "tableId": "table_1", "seatIndex": 4},
        {"id": "g_t1_6", "name": "Lucy Palmer", "initials": "LP", "household": "Lucy Palmer", "email": "lucy.palmer@example.com", "phone": "0411 223 906", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Nut allergy", "song": "Can't Stop the Feeling!", "reminderSent": False, "tableId": "table_1", "seatIndex": 5},
        {"id": "g_t1_7", "name": "Edward Lewis", "initials": "EL", "household": "Edward Lewis", "email": "edward.lewis@example.com", "phone": "0411 223 907", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Shake It Off", "reminderSent": False, "tableId": "table_1", "seatIndex": 6},
        {"id": "g_t1_8", "name": "Chloe Jenkins", "initials": "CJ", "household": "Chloe Jenkins", "email": "chloe.jenkins@example.com", "phone": "0411 223 908", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Gluten-free", "song": "Single Ladies", "reminderSent": False, "tableId": "table_1", "seatIndex": 7},

        # Table 2 (6 seated: NK, GH, WF, FS, GM, QN)
        {"id": "g_t2_1", "name": "Nathan Knight", "initials": "NK", "household": "Nathan Knight", "email": "nathan.k@example.com", "phone": "0412 334 001", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Hey Ya!", "reminderSent": False, "tableId": "table_2", "seatIndex": 0},
        {"id": "g_t2_2", "name": "Georgia Hall", "initials": "GH", "household": "Georgia Hall", "email": "georgia.h@example.com", "phone": "0412 334 002", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Shut Up and Dance", "reminderSent": False, "tableId": "table_2", "seatIndex": 1},
        {"id": "g_t2_3", "name": "William Ford", "initials": "WF", "household": "William Ford", "email": "william.f@example.com", "phone": "0412 334 003", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Vegetarian", "song": "Wonderwall", "reminderSent": False, "tableId": "table_2", "seatIndex": 2},
        {"id": "g_t2_4", "name": "Fiona Scott", "initials": "FS", "household": "Fiona Scott", "email": "fiona.s@example.com", "phone": "0412 334 004", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Happy - Pharrell", "reminderSent": False, "tableId": "table_2", "seatIndex": 3},
        {"id": "g_t2_5", "name": "George Miller", "initials": "GM", "household": "George Miller", "email": "george.m@example.com", "phone": "0412 334 005", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Sugar - Maroon 5", "reminderSent": False, "tableId": "table_2", "seatIndex": 4},
        {"id": "g_t2_6", "name": "Quinn Nelson", "initials": "QN", "household": "Quinn Nelson", "email": "quinn.n@example.com", "phone": "0412 334 006", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Crazy in Love", "reminderSent": False, "tableId": "table_2", "seatIndex": 5},

        # Table 3 (4 seated: IP, GT, YA, ZW)
        {"id": "g_t3_1", "name": "Ian Patel", "initials": "IP", "household": "Ian Patel", "email": "ian.p@example.com", "phone": "0413 445 001", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "24K Magic", "reminderSent": False, "tableId": "table_3", "seatIndex": 0},
        {"id": "g_t3_2", "name": "Grace Turner", "initials": "GT", "household": "Grace Turner", "email": "grace.t@example.com", "phone": "0413 445 002", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Gluten-free", "song": "Treasure", "reminderSent": False, "tableId": "table_3", "seatIndex": 1},
        {"id": "g_t3_3", "name": "Yasmine Abbas", "initials": "YA", "household": "Yasmine Abbas", "email": "yasmine.a@example.com", "phone": "0413 445 003", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Halal", "song": "Levitating", "reminderSent": False, "tableId": "table_3", "seatIndex": 2},
        {"id": "g_t3_4", "name": "Zachary Webb", "initials": "ZW", "household": "Zachary Webb", "email": "zachary.w@example.com", "phone": "0413 445 004", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Get Lucky", "reminderSent": False, "tableId": "table_3", "seatIndex": 3},

        # Table 4 (8 seated: BR, IF, OT, PS (Priya), YR, NP, JT, AD)
        {"id": "g_t4_1", "name": "Benjamin Ross", "initials": "BR", "household": "Benjamin Ross", "email": "ben.ross@example.com", "phone": "0414 556 001", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Good 4 U", "reminderSent": False, "tableId": "table_4", "seatIndex": 0},
        {"id": "g_t4_2", "name": "Isabella Foster", "initials": "IF", "household": "Isabella Foster", "email": "isabella.f@example.com", "phone": "0414 556 002", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Valerie", "reminderSent": False, "tableId": "table_4", "seatIndex": 1},
        {"id": "g_t4_3", "name": "Oliver Thomas", "initials": "OT", "household": "Oliver Thomas", "email": "oliver.t@example.com", "phone": "0414 556 003", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Vegetarian", "song": "Mamma Mia", "reminderSent": False, "tableId": "table_4", "seatIndex": 2},
        # Priya is seat 3
        {"id": "g_t4_5", "name": "Yuvraj Rao", "initials": "YR", "household": "Yuvraj Rao", "email": "yuvraj.r@example.com", "phone": "0414 556 005", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Dynamite", "reminderSent": False, "tableId": "table_4", "seatIndex": 4},
        {"id": "g_t4_6", "name": "Natasha Price", "initials": "NP", "household": "Natasha Price", "email": "natasha.p@example.com", "phone": "0414 556 006", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "About Damn Time", "reminderSent": False, "tableId": "table_4", "seatIndex": 5},
        {"id": "g_t4_7", "name": "Julian Taylor", "initials": "JT", "household": "Julian Taylor", "email": "julian.t@example.com", "phone": "0414 556 007", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Shape of You", "reminderSent": False, "tableId": "table_4", "seatIndex": 6},
        {"id": "g_t4_8", "name": "Alice Davis", "initials": "AD", "household": "Alice Davis", "email": "alice.d@example.com", "phone": "0414 556 008", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Nut allergy", "song": "Watermelon Sugar", "reminderSent": False, "tableId": "table_4", "seatIndex": 7},

        # Table 5 (3 seated: HL, KT, CL)
        {"id": "g_t5_1", "name": "Harper Lewis", "initials": "HL", "household": "Harper Lewis", "email": "harper.l@example.com", "phone": "0415 667 001", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Dance Monkey", "reminderSent": False, "tableId": "table_5", "seatIndex": 0},
        {"id": "g_t5_2", "name": "Kian Thorne", "initials": "KT", "household": "Kian Thorne", "email": "kian.t@example.com", "phone": "0415 667 002", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "song": "Wake Me Up", "reminderSent": False, "tableId": "table_5", "seatIndex": 1},
        {"id": "g_t5_3", "name": "Chloe Lin", "initials": "CL", "household": "Chloe Lin", "email": "chloe.l@example.com", "phone": "0415 667 003", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Gluten-free", "song": "Roar", "reminderSent": False, "tableId": "table_5", "seatIndex": 2},

        # Table 6 (0 seated: empty)

        # 14 Unassigned guests (including the 6 specified in the prompt!)
        {"id": "g_rchen", "name": "Robert Chen", "initials": "RC", "household": "The Chen Family", "email": "robert.c@example.com", "phone": "0421 991 223", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "Vegetarian", "plusOne": True, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_slee", "name": "Sarah Lee", "initials": "SL", "household": "Sarah Lee", "email": "sarah.lee@example.com", "phone": "0433 112 445", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "plusOne": False, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_dwhitfield", "name": "David Whitfield", "initials": "DW", "household": "The Whitfield family", "email": "david.w@example.com", "phone": "0414 556 778", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "plusOne": True, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_mkapoor", "name": "Maya Kapoor", "initials": "MK", "household": "Maya Kapoor", "email": "maya.k@example.com", "phone": "0400 334 556", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Gluten-free", "plusOne": False, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_toneill", "name": "Thomas O'Neill", "initials": "TO", "household": "Thomas O'Neill", "email": "thomas.o@example.com", "phone": "0418 776 554", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "plusOne": True, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_jbrown", "name": "Jessica Brown", "initials": "JB", "household": "Jessica Brown", "email": "jessica.b@example.com", "phone": "0422 998 112", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "plusOne": False, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_lscott", "name": "Liam Scott", "initials": "LS", "household": "Liam Scott", "email": "liam.s@example.com", "phone": "0411 223 344", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "plusOne": True, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_ctaylor", "name": "Chloe Taylor", "initials": "CT", "household": "Chloe Taylor", "email": "chloe.t@example.com", "phone": "0422 334 455", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Vegan", "plusOne": False, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_eharris", "name": "Ethan Harris", "initials": "EH", "household": "Ethan Harris", "email": "ethan.h@example.com", "phone": "0433 445 566", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "plusOne": True, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_omartin", "name": "Olivia Martin", "initials": "OM", "household": "Olivia Martin", "email": "olivia.m@example.com", "phone": "0444 556 677", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "plusOne": False, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_lwhite", "name": "Lucas White", "initials": "LW", "household": "Lucas White", "email": "lucas.w@example.com", "phone": "0455 667 788", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "plusOne": True, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_ghall2", "name": "Grace Hall", "initials": "GH", "household": "Grace Hall", "email": "grace.h2@example.com", "phone": "0466 778 899", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "Nut allergy", "plusOne": False, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_bclark", "name": "Benjamin Clark", "initials": "BC", "household": "Benjamin Clark", "email": "ben.c@example.com", "phone": "0477 889 900", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "plusOne": True, "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_zadams", "name": "Zoe Adams", "initials": "ZA", "household": "Zoe Adams", "email": "zoe.a@example.com", "phone": "0488 990 011", "rsvpStatus": "confirmed", "guestCount": 1, "dietary": "None", "plusOne": False, "reminderSent": False, "tableId": None, "seatIndex": None},

        # Additional confirmed guests bringing confirmed total to 96!
        {"id": "g_conf_extra1", "name": "Sarah & David Lee", "initials": "SL", "household": "The Lee Family", "email": "sarah.lee.couple@example.com", "phone": "0499 111 222", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra2", "name": "Patrick & Claire Murphy", "initials": "PM", "household": "The Murphy Family", "email": "patrick.m@example.com", "phone": "0499 222 333", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra3", "name": "Daniel & Emily Zhang", "initials": "DZ", "household": "The Zhang Family", "email": "daniel.z@example.com", "phone": "0499 333 444", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "Pescatarian", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra4", "name": "Ryan & Stephanie Scott", "initials": "RS", "household": "The Scott Family", "email": "ryan.s@example.com", "phone": "0499 444 555", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra5", "name": "Jack & Mia Wilson", "initials": "JW", "household": "The Wilson Family", "email": "jack.w@example.com", "phone": "0499 555 666", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra6", "name": "Henry & Chloe King", "initials": "HK", "household": "The King Family", "email": "henry.k@example.com", "phone": "0499 666 777", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra7", "name": "Samuel & Lily Baker", "initials": "SB", "household": "The Baker Family", "email": "samuel.b@example.com", "phone": "0499 777 888", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra8", "name": "Noah & Evelyn Carter", "initials": "NC", "household": "The Carter Family", "email": "noah.c@example.com", "phone": "0499 888 999", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra9", "name": "Mason & Harper Brooks", "initials": "MB", "household": "The Brooks Family", "email": "mason.b@example.com", "phone": "0499 999 000", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra10", "name": "Logan & Ava Hughes", "initials": "LH", "household": "The Hughes Family", "email": "logan.h@example.com", "phone": "0498 111 222", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra11", "name": "Leo & Ella Price", "initials": "LP", "household": "The Price Family", "email": "leo.p@example.com", "phone": "0498 222 333", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra12", "name": "Harrison & Scarlett Ward", "initials": "HW", "household": "The Ward Family", "email": "harrison.w@example.com", "phone": "0498 333 444", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra13", "name": "Theo & Sienna Foster", "initials": "TF", "household": "The Foster Family", "email": "theo.f@example.com", "phone": "0498 444 555", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra14", "name": "Oscar & Ruby Powell", "initials": "OP", "household": "The Powell Family", "email": "oscar.p@example.com", "phone": "0498 555 666", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra15", "name": "Archie & Isla Cooper", "initials": "AC", "household": "The Cooper Family", "email": "archie.c@example.com", "phone": "0498 666 777", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra16", "name": "George & Mia Evans", "initials": "GE", "household": "The Evans Family", "email": "george.e@example.com", "phone": "0498 777 888", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra17", "name": "Finn & Zara Mitchell", "initials": "FM", "household": "The Mitchell Family", "email": "finn.m@example.com", "phone": "0498 888 999", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_conf_extra18", "name": "Edward & Sophie Turner", "initials": "ET", "household": "The Turner Family", "email": "edward.t@example.com", "phone": "0498 999 000", "rsvpStatus": "confirmed", "guestCount": 2, "dietary": "None", "reminderSent": False, "tableId": None, "seatIndex": None},

        # Declined guests (9 total)
        {"id": "g_dec1", "name": "Marcus Vance", "initials": "MV", "household": "Marcus Vance", "email": "marcus.v@example.com", "phone": "0471 112 334", "rsvpStatus": "declined", "guestCount": 0, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_dec2", "name": "Helena Ross", "initials": "HR", "household": "Helena Ross", "email": "helena.r@example.com", "phone": "0471 223 445", "rsvpStatus": "declined", "guestCount": 0, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_dec3", "name": "Timothy Drake", "initials": "TD", "household": "Timothy Drake", "email": "tim.d@example.com", "phone": "0471 334 556", "rsvpStatus": "declined", "guestCount": 0, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_dec4", "name": "Claire Redfield", "initials": "CR", "household": "Claire Redfield", "email": "claire.r@example.com", "phone": "0471 445 667", "rsvpStatus": "declined", "guestCount": 0, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_dec5", "name": "Leon Kennedy", "initials": "LK", "household": "Leon Kennedy", "email": "leon.k@example.com", "phone": "0471 556 778", "rsvpStatus": "declined", "guestCount": 0, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_dec6", "name": "Ada Wong", "initials": "AW", "household": "Ada Wong", "email": "ada.w@example.com", "phone": "0471 667 889", "rsvpStatus": "declined", "guestCount": 0, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_dec7", "name": "Jill Valentine", "initials": "JV", "household": "Jill Valentine", "email": "jill.v@example.com", "phone": "0471 778 990", "rsvpStatus": "declined", "guestCount": 0, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_dec8", "name": "Chris Redfield", "initials": "CR", "household": "Chris Redfield", "email": "chris.r@example.com", "phone": "0471 889 001", "rsvpStatus": "declined", "guestCount": 0, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_dec9", "name": "Albert Wesker", "initials": "AW", "household": "Albert Wesker", "email": "albert.w@example.com", "phone": "0471 990 112", "rsvpStatus": "declined", "guestCount": 0, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},

        # Awaiting RSVP guests (22 total)
        {"id": "g_awa1", "name": "Bradley Cooper", "initials": "BC", "household": "The Cooper Family", "email": "bradley.c@example.com", "phone": "0461 111 222", "rsvpStatus": "awaiting", "guestCount": 2, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa2", "name": "Catherine Zeta", "initials": "CZ", "household": "Catherine Zeta", "email": "catherine.z@example.com", "phone": "0461 222 333", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa3", "name": "Daniel Craig", "initials": "DC", "household": "Daniel Craig", "email": "daniel.c@example.com", "phone": "0461 333 444", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa4", "name": "Emma Watson", "initials": "EW", "household": "Emma Watson", "email": "emma.w@example.com", "phone": "0461 444 555", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa5", "name": "Felix Baum", "initials": "FB", "household": "The Baum Family", "email": "felix.b@example.com", "phone": "0461 555 666", "rsvpStatus": "awaiting", "guestCount": 2, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa6", "name": "Gemma Chan", "initials": "GC", "household": "Gemma Chan", "email": "gemma.c@example.com", "phone": "0461 666 777", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa7", "name": "Hugh Jackman", "initials": "HJ", "household": "The Jackman Family", "email": "hugh.j@example.com", "phone": "0461 777 888", "rsvpStatus": "awaiting", "guestCount": 2, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa8", "name": "Isla Fisher", "initials": "IF", "household": "Isla Fisher", "email": "isla.f@example.com", "phone": "0461 888 999", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa9", "name": "Justin Timberlake", "initials": "JT", "household": "The Timberlake Family", "email": "justin.t@example.com", "phone": "0461 999 000", "rsvpStatus": "awaiting", "guestCount": 2, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa10", "name": "Keira Knightley", "initials": "KK", "household": "Keira Knightley", "email": "keira.k@example.com", "phone": "0462 111 222", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa11", "name": "Liam Hemsworth", "initials": "LH", "household": "The Hemsworth Family", "email": "liam.h@example.com", "phone": "0462 222 333", "rsvpStatus": "awaiting", "guestCount": 2, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa12", "name": "Margot Robbie", "initials": "MR", "household": "Margot Robbie", "email": "margot.r@example.com", "phone": "0462 333 444", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa13", "name": "Nicholas Hoult", "initials": "NH", "household": "Nicholas Hoult", "email": "nicholas.h@example.com", "phone": "0462 444 555", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa14", "name": "Olivia Colman", "initials": "OC", "household": "Olivia Colman", "email": "olivia.c@example.com", "phone": "0462 555 666", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa15", "name": "Paul Mescal", "initials": "PM", "household": "Paul Mescal", "email": "paul.m@example.com", "phone": "0462 666 777", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa16", "name": "Rachel Weisz", "initials": "RW", "household": "Rachel Weisz", "email": "rachel.w@example.com", "phone": "0462 777 888", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa17", "name": "Sam Worthington", "initials": "SW", "household": "The Worthington Family", "email": "sam.w@example.com", "phone": "0462 888 999", "rsvpStatus": "awaiting", "guestCount": 2, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa18", "name": "Toni Collette", "initials": "TC", "household": "Toni Collette", "email": "toni.c@example.com", "phone": "0462 999 000", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa19", "name": "Vince Colosimo", "initials": "VC", "household": "Vince Colosimo", "email": "vince.c@example.com", "phone": "0463 111 222", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa20", "name": "Wendy Hughes", "initials": "WH", "household": "Wendy Hughes", "email": "wendy.h@example.com", "phone": "0463 222 333", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa21", "name": "Xavier Samuel", "initials": "XS", "household": "Xavier Samuel", "email": "xavier.s@example.com", "phone": "0463 333 444", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None},
        {"id": "g_awa22", "name": "Yael Stone", "initials": "YS", "household": "Yael Stone", "email": "yael.s@example.com", "phone": "0463 444 555", "rsvpStatus": "awaiting", "guestCount": 1, "dietary": "", "reminderSent": False, "tableId": None, "seatIndex": None}
    ],
    "feed": [
        {
            "id": "f_mile",
            "type": "milestone",
            "title": "50 guests confirmed",
            "subtitle": "You've hit the halfway mark on RSVPs",
            "time": "Just now",
            "likes": 24,
            "comments": [],
            "pinned": True,
            "hidden": False
        },
        {
            "id": "f_note1",
            "type": "note",
            "author": "Aunty Carol",
            "title": "Aunty Carol left a note",
            "quote": "So excited for you both — can't wait to celebrate! 💕",
            "time": "2 minutes ago",
            "likes": 8,
            "comments": ["Can't wait to dance with you Aunty Carol!"],
            "replies": [
                {
                    "author": "Sophie & James",
                    "role": "couple",
                    "text": "Thank you so much Aunty Carol! We can't wait to celebrate and dance with you! 💕",
                    "time": "Just now"
                }
            ],
            "pinned": False,
            "hidden": False
        },
        {
            "id": "f_gift1",
            "type": "gift",
            "author": "The Whitfield family",
            "title": "The Whitfield family sent a gift",
            "subtitle": "via Gift & Go — wishing well contribution",
            "quote": "Wishing you both a lifetime of love and happiness!",
            "time": "38 minutes ago",
            "likes": 5,
            "comments": [],
            "replies": [],
            "pinned": False,
            "hidden": False
        },
        {
            "id": "f_rsvp1",
            "type": "rsvp",
            "author": "Michael Chen",
            "title": "Michael Chen confirmed",
            "subtitle": "Attending, +1 guest · dietary: vegetarian",
            "time": "1 hour ago",
            "likes": 3,
            "comments": [],
            "pinned": False,
            "hidden": False
        },
        {
            "id": "f_photo1",
            "type": "photo",
            "author": "Priya",
            "title": "New photo added",
            "subtitle": "Priya uploaded a photo to the gallery",
            "photoDesc": "Sunset view over Southern Highlands vineyards",
            "time": "3 hours ago",
            "likes": 12,
            "comments": ["Absolutely breathtaking!"],
            "pinned": False,
            "hidden": False
        },
        {
            "id": "f_rsvp2",
            "type": "rsvp",
            "author": "Sarah & David Lee",
            "title": "Sarah & David Lee confirmed",
            "subtitle": "Attending · no plus-one",
            "time": "5 hours ago",
            "likes": 2,
            "comments": [],
            "pinned": False,
            "hidden": False
        }
    ],
    # Gifts received: $4,280; 9 thank-yous due
    "gifts": [
        {"id": "gf1", "from": "The Whitfield family", "amount": 250, "date": "Today", "message": "Wishing you both a lifetime of love and happiness!", "thankYouSent": False},
        {"id": "gf2", "from": "Sarah & Michael Chen", "amount": 300, "date": "Yesterday", "message": "So thrilled for you Sophie and James!", "thankYouSent": False},
        {"id": "gf3", "from": "Aunty Carol & Uncle Peter", "amount": 500, "date": "2 days ago", "message": "With all our love and blessings on your special day.", "thankYouSent": False},
        {"id": "gf4", "from": "Emma & David Wilson", "amount": 200, "date": "3 days ago", "message": "Congratulations to the wonderful couple!", "thankYouSent": False},
        {"id": "gf5", "from": "Marcus & Olivia Vance", "amount": 350, "date": "4 days ago", "message": "Enjoy every second of the celebration!", "thankYouSent": False},
        {"id": "gf6", "from": "The O'Connor Family", "amount": 400, "date": "5 days ago", "message": "Huge congratulations Sophie and James!", "thankYouSent": False},
        {"id": "gf7", "from": "Jessica & Liam Taylor", "amount": 180, "date": "6 days ago", "message": "Can't wait to raise a glass to you both!", "thankYouSent": False},
        {"id": "gf8", "from": "Rob & Chloe Martin", "amount": 250, "date": "1 week ago", "message": "So happy for you guys!", "thankYouSent": False},
        {"id": "gf9", "from": "Grandma Evelyn", "amount": 500, "date": "1 week ago", "message": "May God bless your beautiful marriage.", "thankYouSent": False},
        # Prior gifts that already had thank-yous sent, bringing total to $4,280:
        {"id": "gf10", "from": "Uncle Arthur", "amount": 500, "date": "2 weeks ago", "message": "All our love.", "thankYouSent": True},
        {"id": "gf11", "from": "Fiona & George Miller", "amount": 350, "date": "2 weeks ago", "message": "Cheers to your future together!", "thankYouSent": True},
        {"id": "gf12", "from": "The Davis Family", "amount": 500, "date": "3 weeks ago", "message": "Warmest congratulations!", "thankYouSent": True}
    ],
    "photos": [
        {"id": "p1", "caption": "Southern Highlands winery ceremony lawn", "author": "Priya", "time": "Yesterday"},
        {"id": "p2", "caption": "Tasting session at Fernwood Estate", "author": "Sophie", "time": "3 days ago"},
        {"id": "p3", "caption": "Floral arch preview in natural gum foliage", "author": "Hannah", "time": "1 week ago"},
        {"id": "p4", "caption": "Golden hour over the Mittagong ranges", "author": "James", "time": "2 weeks ago"}
    ],
    "invoices": [
        {"id": "INV-1081", "couple": "Sophie & James", "date": "08 Oct 2026", "amount": 1850, "status": "Paid", "venue": "Fernwood Estate"},
        {"id": "INV-1082", "couple": "Aisha & Marcus", "date": "15 Oct 2026", "amount": 1650, "status": "Pending", "venue": "Doltone House"},
        {"id": "INV-1083", "couple": "Emma & Tom", "date": "01 Nov 2026", "amount": 1950, "status": "Draft", "venue": "Dunbar House"},
        {"id": "INV-1084", "couple": "Katie & Rob", "date": "12 Nov 2026", "amount": 1750, "status": "Draft", "venue": "Dunbar House"}
    ],
    "clients": [
        {"id": "cl1", "couple": "Sophie & James", "phone": "0400 111 222", "email": "sophie.bell@example.com", "weddingDate": "14 Nov 2026", "venue": "Fernwood Estate", "tier": "Platinum MC & Coordination", "deposit": "Paid ($925)", "notes": "Outdoor ceremony on lawn. High energy reception. Live band."},
        {"id": "cl2", "couple": "Aisha & Marcus", "phone": "0400 333 444", "email": "aisha.m@example.com", "weddingDate": "2 May 2027", "venue": "Doltone House", "tier": "Standard MC", "deposit": "Paid ($825)", "notes": "Strict 11:30 PM venue curfew. Formal multi-course dinner."},
        {"id": "cl3", "couple": "Emma & Tom", "phone": "0400 555 666", "email": "emma.t@example.com", "weddingDate": "20 Jun 2027", "venue": "Dunbar House", "tier": "Full Day Master of Ceremonies", "deposit": "Pending", "notes": "Ferry transport coordination for guests from Circular Quay."},
        {"id": "cl4", "couple": "Katie & Rob", "phone": "0400 777 888", "email": "katie.r@example.com", "weddingDate": "11 Jul 2027", "venue": "Dunbar House", "tier": "Standard MC", "deposit": "Pending", "notes": "Intimate winter wedding. Acoustic trio for cocktail hour."}
    ],
    "team": [
        {"id": "tm1", "name": "Robert Galati", "role": "Lead Master of Ceremonies", "email": "robert@galatimc.com.au", "phone": "0418 223 901", "status": "Active"},
        {"id": "tm2", "name": "Sarah Jenkins", "role": "On-day Event Coordinator", "email": "sarah.j@galatimc.com.au", "phone": "0418 223 902", "status": "Active"},
        {"id": "tm3", "name": "Dave Miller", "role": "Sound & AV Technician", "email": "dave.m@galatimc.com.au", "phone": "0418 223 903", "status": "Active"}
    ],
    "tenants": [
        {"id": "ten1", "business": "Robert Galati MC Services", "lead": "Robert Galati", "plan": "Pro", "weddings": 7, "mrr": 299, "status": "Active", "joined": "12 Jan 2025", "stripeConnected": True, "email": "robert@galatimc.com.au"},
        {"id": "ten2", "business": "Coastal Celebrations MC", "lead": "Marcus Thorne", "plan": "Pro", "weddings": 5, "mrr": 299, "status": "Active", "joined": "04 Mar 2025", "stripeConnected": True, "email": "marcus@coastalmc.com.au"},
        {"id": "ten3", "business": "Sydney Vows & Beats", "lead": "Elena Rostova", "plan": "Standard", "weddings": 3, "mrr": 199, "status": "Active", "joined": "18 May 2025", "stripeConnected": True, "email": "elena@sydneyvows.com.au"},
        {"id": "ten4", "business": "Melbourne Elite Hosts", "lead": "Julian Brooks", "plan": "Starter", "weddings": 1, "mrr": 99, "status": "Suspended", "joined": "01 Aug 2025", "stripeConnected": False, "email": "julian@melbourneelite.com.au"}
    ],
    "featureFlags": {
        "digitalGifting": True,
        "aiSeating": True,
        "qardPrinting": True,
        "photoModeration": True,
        "smsReminders": False
    },
    "supportTickets": [
        {"id": "TCK-401", "tenant": "Robert Galati MC Services", "subject": "Custom run sheet export formatting for print", "priority": "Medium", "status": "Open", "date": "08 Oct 2026", "messages": [{"sender": "Robert Galati", "text": "Can we include dietary badges on the printed MC run sheet?", "time": "Yesterday"}, {"sender": "Tap & Toast Support", "text": "Hi Robert, that feature is coming in the next release! You can currently view dietaries in the Guest Summary tab.", "time": "2 hours ago"}]},
        {"id": "TCK-402", "tenant": "Coastal Celebrations MC", "subject": "Stripe payout schedule for December events", "priority": "High", "status": "In Progress", "date": "07 Oct 2026", "messages": [{"sender": "Marcus Thorne", "text": "We need 24hr payout clearance for weekend gifting disbursements.", "time": "2 days ago"}]},
        {"id": "TCK-403", "tenant": "Sydney Vows & Beats", "subject": "NFC backup options for QaRd cards", "priority": "Low", "status": "Resolved", "date": "02 Oct 2026", "messages": [{"sender": "Elena Rostova", "text": "Resolved: QR code scan works seamlessly without requiring NFC hardware.", "time": "1 week ago"}]}
    ],
    "auditLog": [
        {"id": "aud1", "timestamp": "2026-10-09 14:15", "actor": "Michael Chen", "action": "RSVP Confirmed", "details": "Confirmed attendance (+1 guest, vegetarian)", "category": "RSVP"},
        {"id": "aud2", "timestamp": "2026-10-09 13:42", "actor": "The Whitfield family", "action": "Gift & Go Received", "details": "Sent $250 AUD gift with message", "category": "Gifting"},
        {"id": "aud3", "timestamp": "2026-10-09 12:10", "actor": "Aunty Carol", "action": "Feed Note Posted", "details": "Posted a Love Note on celebration feed", "category": "Feed"},
        {"id": "aud4", "timestamp": "2026-10-09 11:00", "actor": "Priya Sharma", "action": "Photo Uploaded", "details": "Added photo to wedding photo wall", "category": "Photos"},
        {"id": "aud5", "timestamp": "2026-10-09 09:20", "actor": "Sophie (Couple)", "action": "Seating Updated", "details": "Assigned Table 4 seating arrangement", "category": "Seating"},
        {"id": "aud6", "timestamp": "2026-10-08 17:00", "actor": "Robert Galati (MC)", "action": "Run Sheet Updated", "details": "Updated reception timings and speech order", "category": "Run Sheet"}
    ],
    "users": [
        {
            "id": "u_mc1",
            "email": "robert@galati.demo",
            "passwordHash": "dHRfc2FsdF9EZW1vMTIzNCE=",  # demo only hash: btoa('tt_salt_' + password)
            "name": "Robert Galati",
            "role": "mc",
            "tenantId": "ten1",
            "business": "Robert Galati MC Services"
        },
        {
            "id": "u_couple1",
            "email": "sophie.james@demo.test",
            "passwordHash": "dHRfc2FsdF9EZW1vMTIzNCE=",  # demo only hash
            "name": "Sophie & James",
            "role": "couple",
            "weddingId": "w1"
        },
        {
            "id": "u_admin1",
            "email": "admin@tapandtoast.demo",
            "passwordHash": "dHRfc2FsdF9EZW1vMTIzNCE=",  # demo only hash
            "name": "Platform Admin",
            "role": "superadmin"
        }
    ],
    "invites": [
        {
            "code": "SJ-2026",
            "weddingId": "w1",
            "couple": "Sophie & James",
            "partner1": "Sophie",
            "partner2": "James",
            "mc": "Robert Galati",
            "weddingDate": "14 Nov 2026",
            "venue": "Fernwood Estate, Southern Highlands",
            "used": False
        }
    ]
}

def get_seed_state_json():
    return json.dumps(SEED_STATE)
