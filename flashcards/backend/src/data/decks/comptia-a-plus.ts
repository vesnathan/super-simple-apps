import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const compTIAAPlus: SeedDeck = createDeck(
  "CompTIA A+ Core Concepts",
  "Master the fundamentals for CompTIA A+ certification. Covers hardware components, BIOS/UEFI, RAM types, storage devices, networking basics, troubleshooting, and essential IT support concepts.",
  ["it", "it-certifications", "certification", "networking"],
  [
  // Hardware - Motherboards
  mcCard(
    "What does BIOS stand for?",
    ["Basic Input/Output System", "Binary Input/Output System", "Basic Integrated Operating System"],
    0,
    "BIOS is firmware that initializes hardware during the boot process."
  ),
  mcCard(
    "What is UEFI?",
    ["Unified Extensible Firmware Interface - modern BIOS replacement", "Universal External Firmware Interface", "Unified External File Interface"],
    0,
    "UEFI is the modern replacement for legacy BIOS with more features."
  ),
  mcCard(
    "What does POST stand for?",
    ["Power-On Self-Test", "Primary Operating System Test", "Processor Output System Test"],
    0,
    "POST checks hardware components during system startup."
  ),
  textCard(
    "What is CMOS?",
    "Complementary Metal-Oxide Semiconductor - stores BIOS settings and is powered by a battery when the PC is off."
  ),
  mcCard(
    "What battery type is typically used for CMOS?",
    ["CR2032", "AA", "9V"],
    0,
    "CR2032 is a 3V lithium coin cell battery used for CMOS."
  ),
  textCard(
    "What are the symptoms of a dead CMOS battery?",
    "System date/time reset, BIOS settings lost, boot errors, or beep codes on startup."
  ),
  mcCard(
    "Which motherboard form factor is most common in desktop PCs?",
    ["ATX", "Mini-ITX", "BTX"],
    0,
    "ATX (Advanced Technology Extended) is the standard desktop form factor."
  ),
  textCard(
    "What is the difference between ATX and Micro-ATX?",
    "Micro-ATX is smaller (9.6\" x 9.6\" vs 12\" x 9.6\") with fewer expansion slots but compatible with ATX cases."
  ),

  // CPU
  mcCard(
    "What is the purpose of thermal paste?",
    ["Improves heat transfer between CPU and heatsink", "Lubricates CPU fan", "Prevents static electricity"],
    0,
    "Thermal paste fills microscopic gaps to improve heat conduction."
  ),
  mcCard(
    "What is CPU throttling?",
    ["Reducing CPU speed to prevent overheating", "Increasing CPU speed for performance", "Disabling CPU cores"],
    0,
    "Throttling slows the CPU when temperatures get too high."
  ),
  textCard(
    "What is hyperthreading?",
    "Intel technology allowing each physical CPU core to act as two logical cores."
  ),
  textCard(
    "What is the difference between 32-bit and 64-bit processors?",
    "64-bit processors can address more than 4GB RAM, process larger data chunks, and run 64-bit software."
  ),
  mcCard(
    "What determines CPU socket compatibility?",
    ["Physical socket type and chipset", "CPU speed only", "Number of cores"],
    0,
    "CPUs must match the motherboard's socket type (e.g., LGA1200, AM4)."
  ),

  // Memory (RAM)
  mcCard(
    "What type of memory loses data when power is off?",
    ["RAM (volatile)", "ROM (non-volatile)", "SSD"],
    0,
    "RAM is volatile memory - it requires constant power to retain data."
  ),
  mcCard(
    "What is the current standard for desktop RAM?",
    ["DDR4/DDR5", "DDR2", "SDRAM"],
    0,
    "DDR4 is common, with DDR5 becoming the new standard."
  ),
  textCard(
    "What does ECC memory do?",
    "Error-Correcting Code memory detects and corrects single-bit memory errors, used in servers."
  ),
  mcCard(
    "What is dual-channel memory?",
    ["Using matched pairs for increased bandwidth", "Two types of RAM together", "RAM with two speeds"],
    0,
    "Dual-channel doubles memory bandwidth using matched RAM pairs."
  ),
  textCard(
    "What happens if you mix RAM speeds?",
    "All RAM runs at the speed of the slowest module. Best practice is to use matched sets."
  ),
  mcCard(
    "SO-DIMM is used in which type of device?",
    ["Laptops", "Desktop computers", "Servers"],
    0,
    "SO-DIMM (Small Outline DIMM) is the smaller RAM form factor for laptops."
  ),

  // Storage
  mcCard(
    "Which connector is used for modern internal hard drives?",
    ["SATA", "IDE/PATA", "SCSI"],
    0,
    "SATA is the current standard for internal storage connections."
  ),
  mcCard(
    "What is the typical SATA III data transfer speed?",
    ["6 Gbps", "3 Gbps", "1.5 Gbps"],
    0,
    "SATA III supports up to 6 Gbps (about 600 MB/s actual throughput)."
  ),
  textCard(
    "What is NVMe?",
    "Non-Volatile Memory Express - a protocol for SSDs connected via PCIe, much faster than SATA SSDs."
  ),
  mcCard(
    "What is the M.2 form factor?",
    ["Small SSD format connecting directly to motherboard", "External hard drive format", "Old IDE drive format"],
    0,
    "M.2 is a small form factor for SSDs, supporting SATA or NVMe."
  ),
  mcCard(
    "What does RAID 0 provide?",
    ["Striping for performance, no redundancy", "Mirroring for redundancy", "Parity with fault tolerance"],
    0,
    "RAID 0 stripes data across drives for speed but offers no data protection."
  ),
  mcCard(
    "What does RAID 1 provide?",
    ["Mirroring for redundancy", "Striping for performance", "Parity distributed across drives"],
    0,
    "RAID 1 mirrors data across two drives for fault tolerance."
  ),
  mcCard(
    "What does RAID 5 require minimum?",
    ["3 drives", "2 drives", "4 drives"],
    0,
    "RAID 5 requires at least 3 drives for distributed parity."
  ),
  textCard(
    "What is the difference between HDD and SSD?",
    "HDD uses spinning platters (mechanical), SSD uses flash memory (no moving parts). SSDs are faster, more durable, but cost more per GB."
  ),

  // Power
  mcCard(
    "What is the main motherboard power connector?",
    ["24-pin ATX", "4-pin Molex", "6-pin PCIe"],
    0,
    "The 24-pin ATX connector provides main power to the motherboard."
  ),
  mcCard(
    "What additional power connector do modern CPUs require?",
    ["4/8-pin EPS/ATX12V", "24-pin ATX", "6-pin PCIe"],
    0,
    "The 4-pin or 8-pin EPS connector provides additional CPU power."
  ),
  mcCard(
    "What power connectors do modern GPUs typically use?",
    ["6-pin and/or 8-pin PCIe", "Molex only", "SATA power"],
    0,
    "High-performance GPUs use 6-pin and 8-pin PCIe power connectors."
  ),
  textCard(
    "What is the purpose of a UPS?",
    "Uninterruptible Power Supply provides backup power during outages and protects against surges."
  ),
  mcCard(
    "What does a surge protector protect against?",
    ["Voltage spikes", "Power outages", "EMI interference"],
    0,
    "Surge protectors protect equipment from voltage spikes in the power line."
  ),

  // Expansion Cards
  mcCard(
    "What is the current standard expansion slot for graphics cards?",
    ["PCIe x16", "AGP", "PCI"],
    0,
    "PCIe x16 is used for modern graphics cards."
  ),
  textCard(
    "What is a riser card?",
    "Allows expansion cards to be mounted parallel to the motherboard, common in small form factor cases."
  ),

  // Ports and Connectors
  mcCard(
    "What is USB Type-C?",
    ["Reversible connector supporting USB 3.x and Thunderbolt", "Older rectangular USB", "Mini USB"],
    0,
    "USB-C is a reversible connector supporting high speeds and power delivery."
  ),
  mcCard(
    "What is the maximum speed of USB 3.2 Gen 2?",
    ["10 Gbps", "5 Gbps", "480 Mbps"],
    0,
    "USB 3.2 Gen 2 supports up to 10 Gbps."
  ),
  textCard(
    "What is Thunderbolt 3/4?",
    "High-speed interface (40 Gbps) using USB-C connector, supports data, video, and power."
  ),
  mcCard(
    "Which port is used for modern monitor connections?",
    ["DisplayPort or HDMI", "VGA", "DVI"],
    0,
    "DisplayPort and HDMI are current standards for video output."
  ),

  // Displays
  mcCard(
    "What does LCD stand for?",
    ["Liquid Crystal Display", "Light Crystal Display", "Laser Color Display"],
    0,
    "LCD uses liquid crystals and a backlight to display images."
  ),
  textCard(
    "What is the difference between LCD and OLED?",
    "LCD uses a backlight with liquid crystals; OLED has self-emitting pixels for better contrast and thinner displays."
  ),
  mcCard(
    "What is display resolution?",
    ["Number of pixels (width x height)", "Screen size in inches", "Refresh rate"],
    0,
    "Resolution is measured in pixels, e.g., 1920x1080 (1080p)."
  ),

  // Printers
  mcCard(
    "How does a laser printer work?",
    ["Uses a laser to create image on drum, then fuses toner", "Sprays ink through nozzles", "Impacts ribbon onto paper"],
    0,
    "Laser printers use electrostatic charge and heat to fuse toner."
  ),
  mcCard(
    "What is the main consumable in an inkjet printer?",
    ["Ink cartridges", "Toner", "Drum"],
    0,
    "Inkjet printers use liquid ink cartridges."
  ),
  textCard(
    "What is a thermal printer?",
    "Uses heat to produce images on special paper. Common for receipts and labels."
  ),

  // Networking Hardware
  mcCard(
    "What device connects multiple devices in a network?",
    ["Switch", "Modem", "Repeater"],
    0,
    "A switch connects devices within a LAN using MAC addresses."
  ),
  textCard(
    "What is the difference between a switch and a hub?",
    "A switch sends data only to the intended device (using MAC addresses); a hub broadcasts to all ports."
  ),
  mcCard(
    "What does a router do?",
    ["Connects different networks and routes traffic between them", "Connects devices in a single network", "Converts digital to analog"],
    0,
    "Routers connect networks and direct traffic using IP addresses."
  ),
  textCard(
    "What is a modem?",
    "Modulator-Demodulator converts digital signals to analog (and vice versa) for transmission over phone/cable lines."
  ),

  // Windows Tools
  mcCard(
    "Which Windows tool checks and repairs system files?",
    ["sfc /scannow", "chkdsk", "defrag"],
    0,
    "System File Checker (sfc) scans and repairs Windows system files."
  ),
  mcCard(
    "What does DISM do in Windows?",
    ["Repairs Windows image and components", "Defragments disk", "Manages devices"],
    0,
    "Deployment Image Servicing and Management repairs Windows images."
  ),
  textCard(
    "What does chkdsk do?",
    "Checks disk for file system errors and bad sectors, and can repair them."
  ),
  mcCard(
    "Which Windows tool manages startup programs?",
    ["Task Manager or msconfig", "Device Manager", "Disk Management"],
    0,
    "Task Manager (Windows 10/11) or msconfig controls startup programs."
  ),
  textCard(
    "What is Safe Mode?",
    "Windows diagnostic mode that loads minimal drivers and services to troubleshoot problems."
  ),
  mcCard(
    "How do you access Safe Mode in Windows 10/11?",
    ["Shift + Restart, or Settings > Recovery", "F8 during boot", "Delete during boot"],
    0,
    "Hold Shift while clicking Restart, or use Settings > Recovery > Advanced Startup."
  ),

  // Security
  mcCard(
    "What does ESD stand for?",
    ["Electrostatic Discharge", "Electronic System Damage", "External Storage Device"],
    0,
    "ESD can damage computer components through static electricity."
  ),
  textCard(
    "How do you prevent ESD damage?",
    "Use an anti-static wrist strap, work on anti-static mat, touch grounded metal before handling components."
  ),
  mcCard(
    "What is BitLocker?",
    ["Windows full-disk encryption", "Antivirus software", "Firewall software"],
    0,
    "BitLocker encrypts entire drives to protect data."
  ),
  textCard(
    "What is TPM?",
    "Trusted Platform Module - a security chip that stores encryption keys and verifies system integrity."
  ),
  mcCard(
    "What type of malware encrypts files and demands payment?",
    ["Ransomware", "Spyware", "Adware"],
    0,
    "Ransomware encrypts your files and demands ransom for the decryption key."
  ),
  mcCard(
    "What is phishing?",
    ["Fraudulent attempt to obtain sensitive information", "Virus that spreads via email", "Network scanning attack"],
    0,
    "Phishing uses deceptive emails/websites to steal credentials."
  ),

  // Virtualization
  textCard(
    "What is virtualization?",
    "Running multiple operating systems on a single physical machine using a hypervisor."
  ),
  mcCard(
    "Which CPU feature is required for virtualization?",
    ["Intel VT-x or AMD-V", "Hyperthreading", "Overclocking support"],
    0,
    "Hardware virtualization requires VT-x (Intel) or AMD-V (AMD) support."
  ),
  mcCard(
    "What is a Type 1 hypervisor?",
    ["Runs directly on hardware (bare metal)", "Runs on top of an OS", "Software-only virtualization"],
    0,
    "Type 1 (bare metal) hypervisors like ESXi run directly on hardware."
  ),
  textCard(
    "What is a Type 2 hypervisor?",
    "Runs on top of a host operating system, like VirtualBox or VMware Workstation."
  ),

  // Mobile Devices
  mcCard(
    "What is the difference between GPS and cellular location?",
    ["GPS uses satellites; cellular uses tower triangulation", "They are the same", "GPS uses Wi-Fi"],
    0,
    "GPS uses satellite signals; cellular location uses cell tower positions."
  ),
  textCard(
    "What is MDM?",
    "Mobile Device Management - software to manage, secure, and control mobile devices in organizations."
  ),
  mcCard(
    "What is a hotspot?",
    ["Device sharing its cellular connection via Wi-Fi", "Wi-Fi access point only", "Bluetooth connection"],
    0,
    "A hotspot shares a device's cellular data connection with other devices."
  ),

  // Troubleshooting
  textCard(
    "What are the 6 steps of troubleshooting?",
    "1) Identify problem, 2) Establish theory, 3) Test theory, 4) Plan of action, 5) Implement solution, 6) Document findings."
  ),
  mcCard(
    "Computer won't POST - what should you check first?",
    ["Power connections and RAM seating", "Hard drive", "Windows updates"],
    0,
    "No POST often means power issues or improperly seated RAM."
  ),
  textCard(
    "What do beep codes indicate?",
    "Hardware problems detected during POST - specific patterns indicate specific failures (varies by BIOS manufacturer)."
  ),
  mcCard(
    "Blue Screen of Death (BSOD) usually indicates:",
    ["Hardware failure or driver problem", "Software virus", "Normal Windows update"],
    0,
    "BSODs are usually caused by faulty hardware, drivers, or system files."
  ),
  textCard(
    "What does 'bootable device not found' mean?",
    "BIOS can't find a drive with an operating system - check boot order, connections, and drive health."
  ),
]);
