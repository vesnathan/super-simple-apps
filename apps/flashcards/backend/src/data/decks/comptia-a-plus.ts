import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const compTIAAPlus: SeedDeck = createDeck(
  "a1b2c3d4-1111-4000-8000-000000000003",
  "CompTIA A+ Core Concepts",
  "Master the fundamentals for CompTIA A+ certification. Covers hardware components, BIOS/UEFI, RAM types, storage devices, networking basics, troubleshooting, and essential IT support concepts.",
  ["it", "it-certifications", "certification", "networking"],
  [
  // Hardware - Motherboards
  mcCard(
    "What does BIOS stand for?",
    ["Basic Input/Output System", "Binary Input/Output System", "Basic Integrated Operating System"],
    0,
    { explanation: "BIOS is firmware that initializes hardware during the boot process.", researchUrl: "https://en.wikipedia.org/wiki/BIOS" }
  ),
  mcCard(
    "What is UEFI?",
    ["Unified Extensible Firmware Interface - modern BIOS replacement", "Universal External Firmware Interface", "Unified External File Interface"],
    0,
    { explanation: "UEFI is the modern replacement for legacy BIOS with more features.", researchUrl: "https://en.wikipedia.org/wiki/UEFI" }
  ),
  mcCard(
    "What does POST stand for?",
    ["Power-On Self-Test", "Primary Operating System Test", "Processor Output System Test"],
    0,
    { explanation: "POST checks hardware components during system startup.", researchUrl: "https://en.wikipedia.org/wiki/Power-on_self-test" }
  ),
  textCard(
    "What is CMOS?",
    "Complementary Metal-Oxide Semiconductor - stores BIOS settings and is powered by a battery when the PC is off.",
    { researchUrl: "https://en.wikipedia.org/wiki/Nonvolatile_BIOS_memory" }
  ),
  mcCard(
    "What battery type is typically used for CMOS?",
    ["CR2032", "AA", "9V"],
    0,
    { explanation: "CR2032 is a 3V lithium coin cell battery used for CMOS.", researchUrl: "https://en.wikipedia.org/wiki/CR2032_battery" }
  ),
  textCard(
    "What are the symptoms of a dead CMOS battery?",
    "System date/time reset, BIOS settings lost, boot errors, or beep codes on startup.",
    { researchUrl: "https://www.intel.com/content/www/us/en/support/articles/000005739/boards-and-kits.html" }
  ),
  mcCard(
    "Which motherboard form factor is most common in desktop PCs?",
    ["ATX", "Mini-ITX", "BTX"],
    0,
    { explanation: "ATX (Advanced Technology Extended) is the standard desktop form factor.", researchUrl: "https://en.wikipedia.org/wiki/ATX" }
  ),
  textCard(
    "What is the difference between ATX and Micro-ATX?",
    "Micro-ATX is smaller (9.6\" x 9.6\" vs 12\" x 9.6\") with fewer expansion slots but compatible with ATX cases.",
    { researchUrl: "https://en.wikipedia.org/wiki/MicroATX" }
  ),

  // CPU
  mcCard(
    "What is the purpose of thermal paste?",
    ["Improves heat transfer between CPU and heatsink", "Lubricates CPU fan", "Prevents static electricity"],
    0,
    { explanation: "Thermal paste fills microscopic gaps to improve heat conduction.", researchUrl: "https://en.wikipedia.org/wiki/Thermal_paste" }
  ),
  mcCard(
    "What is CPU throttling?",
    ["Reducing CPU speed to prevent overheating", "Increasing CPU speed for performance", "Disabling CPU cores"],
    0,
    { explanation: "Throttling slows the CPU when temperatures get too high.", researchUrl: "https://en.wikipedia.org/wiki/Dynamic_frequency_scaling" }
  ),
  textCard(
    "What is hyperthreading?",
    "Intel technology allowing each physical CPU core to act as two logical cores.",
    { researchUrl: "https://en.wikipedia.org/wiki/Hyper-threading" }
  ),
  textCard(
    "What is the difference between 32-bit and 64-bit processors?",
    "64-bit processors can address more than 4GB RAM, process larger data chunks, and run 64-bit software.",
    { researchUrl: "https://en.wikipedia.org/wiki/64-bit_computing" }
  ),
  mcCard(
    "What determines CPU socket compatibility?",
    ["Physical socket type and chipset", "CPU speed only", "Number of cores"],
    0,
    { explanation: "CPUs must match the motherboard's socket type (e.g., LGA1200, AM4).", researchUrl: "https://en.wikipedia.org/wiki/CPU_socket" }
  ),

  // Memory (RAM)
  mcCard(
    "What type of memory loses data when power is off?",
    ["RAM (volatile)", "ROM (non-volatile)", "SSD"],
    0,
    { explanation: "RAM is volatile memory - it requires constant power to retain data.", researchUrl: "https://en.wikipedia.org/wiki/Random-access_memory" }
  ),
  mcCard(
    "What is the current standard for desktop RAM?",
    ["DDR4/DDR5", "DDR2", "SDRAM"],
    0,
    { explanation: "DDR4 is common, with DDR5 becoming the new standard.", researchUrl: "https://en.wikipedia.org/wiki/DDR4_SDRAM" }
  ),
  textCard(
    "What does ECC memory do?",
    "Error-Correcting Code memory detects and corrects single-bit memory errors, used in servers.",
    { researchUrl: "https://en.wikipedia.org/wiki/ECC_memory" }
  ),
  mcCard(
    "What is dual-channel memory?",
    ["Using matched pairs for increased bandwidth", "Two types of RAM together", "RAM with two speeds"],
    0,
    { explanation: "Dual-channel doubles memory bandwidth using matched RAM pairs.", researchUrl: "https://en.wikipedia.org/wiki/Multi-channel_memory_architecture" }
  ),
  textCard(
    "What happens if you mix RAM speeds?",
    "All RAM runs at the speed of the slowest module. Best practice is to use matched sets.",
    { researchUrl: "https://www.crucial.com/articles/about-memory/can-i-mix-ram-brands" }
  ),
  mcCard(
    "SO-DIMM is used in which type of device?",
    ["Laptops", "Desktop computers", "Servers"],
    0,
    { explanation: "SO-DIMM (Small Outline DIMM) is the smaller RAM form factor for laptops.", researchUrl: "https://en.wikipedia.org/wiki/SO-DIMM" }
  ),

  // Storage
  mcCard(
    "Which connector is used for modern internal hard drives?",
    ["SATA", "IDE/PATA", "SCSI"],
    0,
    { explanation: "SATA is the current standard for internal storage connections.", researchUrl: "https://en.wikipedia.org/wiki/SATA" }
  ),
  mcCard(
    "What is the typical SATA III data transfer speed?",
    ["6 Gbps", "3 Gbps", "1.5 Gbps"],
    0,
    { explanation: "SATA III supports up to 6 Gbps (about 600 MB/s actual throughput).", researchUrl: "https://en.wikipedia.org/wiki/SATA#SATA_revision_3.0_(6_Gbit/s,_600_MB/s,_Serial_ATA-600)" }
  ),
  textCard(
    "What is NVMe?",
    "Non-Volatile Memory Express - a protocol for SSDs connected via PCIe, much faster than SATA SSDs.",
    { researchUrl: "https://en.wikipedia.org/wiki/NVM_Express" }
  ),
  mcCard(
    "What is the M.2 form factor?",
    ["Small SSD format connecting directly to motherboard", "External hard drive format", "Old IDE drive format"],
    0,
    { explanation: "M.2 is a small form factor for SSDs, supporting SATA or NVMe.", researchUrl: "https://en.wikipedia.org/wiki/M.2" }
  ),
  mcCard(
    "What does RAID 0 provide?",
    ["Striping for performance, no redundancy", "Mirroring for redundancy", "Parity with fault tolerance"],
    0,
    { explanation: "RAID 0 stripes data across drives for speed but offers no data protection.", researchUrl: "https://en.wikipedia.org/wiki/RAID#RAID_0" }
  ),
  mcCard(
    "What does RAID 1 provide?",
    ["Mirroring for redundancy", "Striping for performance", "Parity distributed across drives"],
    0,
    { explanation: "RAID 1 mirrors data across two drives for fault tolerance.", researchUrl: "https://en.wikipedia.org/wiki/RAID#RAID_1" }
  ),
  mcCard(
    "What does RAID 5 require minimum?",
    ["3 drives", "2 drives", "4 drives"],
    0,
    { explanation: "RAID 5 requires at least 3 drives for distributed parity.", researchUrl: "https://en.wikipedia.org/wiki/RAID#RAID_5" }
  ),
  textCard(
    "What is the difference between HDD and SSD?",
    "HDD uses spinning platters (mechanical), SSD uses flash memory (no moving parts). SSDs are faster, more durable, but cost more per GB.",
    { researchUrl: "https://en.wikipedia.org/wiki/Solid-state_drive" }
  ),

  // Power
  mcCard(
    "What is the main motherboard power connector?",
    ["24-pin ATX", "4-pin Molex", "6-pin PCIe"],
    0,
    { explanation: "The 24-pin ATX connector provides main power to the motherboard.", researchUrl: "https://en.wikipedia.org/wiki/ATX#Power_supply" }
  ),
  mcCard(
    "What additional power connector do modern CPUs require?",
    ["4/8-pin EPS/ATX12V", "24-pin ATX", "6-pin PCIe"],
    0,
    { explanation: "The 4-pin or 8-pin EPS connector provides additional CPU power.", researchUrl: "https://en.wikipedia.org/wiki/ATX#EPS12V" }
  ),
  mcCard(
    "What power connectors do modern GPUs typically use?",
    ["6-pin and/or 8-pin PCIe", "Molex only", "SATA power"],
    0,
    { explanation: "High-performance GPUs use 6-pin and 8-pin PCIe power connectors.", researchUrl: "https://en.wikipedia.org/wiki/PCI_Express#Power" }
  ),
  textCard(
    "What is the purpose of a UPS?",
    "Uninterruptible Power Supply provides backup power during outages and protects against surges.",
    { researchUrl: "https://en.wikipedia.org/wiki/Uninterruptible_power_supply" }
  ),
  mcCard(
    "What does a surge protector protect against?",
    ["Voltage spikes", "Power outages", "EMI interference"],
    0,
    { explanation: "Surge protectors protect equipment from voltage spikes in the power line.", researchUrl: "https://en.wikipedia.org/wiki/Surge_protector" }
  ),

  // Expansion Cards
  mcCard(
    "What is the current standard expansion slot for graphics cards?",
    ["PCIe x16", "AGP", "PCI"],
    0,
    { explanation: "PCIe x16 is used for modern graphics cards.", researchUrl: "https://en.wikipedia.org/wiki/PCI_Express" }
  ),
  textCard(
    "What is a riser card?",
    "Allows expansion cards to be mounted parallel to the motherboard, common in small form factor cases.",
    { researchUrl: "https://en.wikipedia.org/wiki/Riser_card" }
  ),

  // Ports and Connectors
  mcCard(
    "What is USB Type-C?",
    ["Reversible connector supporting USB 3.x and Thunderbolt", "Older rectangular USB", "Mini USB"],
    0,
    { explanation: "USB-C is a reversible connector supporting high speeds and power delivery.", researchUrl: "https://en.wikipedia.org/wiki/USB-C" }
  ),
  mcCard(
    "What is the maximum speed of USB 3.2 Gen 2?",
    ["10 Gbps", "5 Gbps", "480 Mbps"],
    0,
    { explanation: "USB 3.2 Gen 2 supports up to 10 Gbps.", researchUrl: "https://en.wikipedia.org/wiki/USB_3.0#USB_3.2" }
  ),
  textCard(
    "What is Thunderbolt 3/4?",
    "High-speed interface (40 Gbps) using USB-C connector, supports data, video, and power.",
    { researchUrl: "https://en.wikipedia.org/wiki/Thunderbolt_(interface)" }
  ),
  mcCard(
    "Which port is used for modern monitor connections?",
    ["DisplayPort or HDMI", "VGA", "DVI"],
    0,
    { explanation: "DisplayPort and HDMI are current standards for video output.", researchUrl: "https://en.wikipedia.org/wiki/DisplayPort" }
  ),

  // Displays
  mcCard(
    "What does LCD stand for?",
    ["Liquid Crystal Display", "Light Crystal Display", "Laser Color Display"],
    0,
    { explanation: "LCD uses liquid crystals and a backlight to display images.", researchUrl: "https://en.wikipedia.org/wiki/Liquid-crystal_display" }
  ),
  textCard(
    "What is the difference between LCD and OLED?",
    "LCD uses a backlight with liquid crystals; OLED has self-emitting pixels for better contrast and thinner displays.",
    { researchUrl: "https://en.wikipedia.org/wiki/OLED" }
  ),
  mcCard(
    "What is display resolution?",
    ["Number of pixels (width x height)", "Screen size in inches", "Refresh rate"],
    0,
    { explanation: "Resolution is measured in pixels, e.g., 1920x1080 (1080p).", researchUrl: "https://en.wikipedia.org/wiki/Display_resolution" }
  ),

  // Printers
  mcCard(
    "How does a laser printer work?",
    ["Uses a laser to create image on drum, then fuses toner", "Sprays ink through nozzles", "Impacts ribbon onto paper"],
    0,
    { explanation: "Laser printers use electrostatic charge and heat to fuse toner.", researchUrl: "https://en.wikipedia.org/wiki/Laser_printing" }
  ),
  mcCard(
    "What is the main consumable in an inkjet printer?",
    ["Ink cartridges", "Toner", "Drum"],
    0,
    { explanation: "Inkjet printers use liquid ink cartridges.", researchUrl: "https://en.wikipedia.org/wiki/Inkjet_printing" }
  ),
  textCard(
    "What is a thermal printer?",
    "Uses heat to produce images on special paper. Common for receipts and labels.",
    { researchUrl: "https://en.wikipedia.org/wiki/Thermal_printing" }
  ),

  // Networking Hardware
  mcCard(
    "What device connects multiple devices in a network?",
    ["Switch", "Modem", "Repeater"],
    0,
    { explanation: "A switch connects devices within a LAN using MAC addresses.", researchUrl: "https://en.wikipedia.org/wiki/Network_switch" }
  ),
  textCard(
    "What is the difference between a switch and a hub?",
    "A switch sends data only to the intended device (using MAC addresses); a hub broadcasts to all ports.",
    { researchUrl: "https://en.wikipedia.org/wiki/Ethernet_hub" }
  ),
  mcCard(
    "What does a router do?",
    ["Connects different networks and routes traffic between them", "Connects devices in a single network", "Converts digital to analog"],
    0,
    { explanation: "Routers connect networks and direct traffic using IP addresses.", researchUrl: "https://en.wikipedia.org/wiki/Router_(computing)" }
  ),
  textCard(
    "What is a modem?",
    "Modulator-Demodulator converts digital signals to analog (and vice versa) for transmission over phone/cable lines.",
    { researchUrl: "https://en.wikipedia.org/wiki/Modem" }
  ),

  // Windows Tools
  mcCard(
    "Which Windows tool checks and repairs system files?",
    ["sfc /scannow", "chkdsk", "defrag"],
    0,
    { explanation: "System File Checker (sfc) scans and repairs Windows system files.", researchUrl: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/sfc" }
  ),
  mcCard(
    "What does DISM do in Windows?",
    ["Repairs Windows image and components", "Defragments disk", "Manages devices"],
    0,
    { explanation: "Deployment Image Servicing and Management repairs Windows images.", researchUrl: "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/dism---deployment-image-servicing-and-management-technical-reference-for-windows" }
  ),
  textCard(
    "What does chkdsk do?",
    "Checks disk for file system errors and bad sectors, and can repair them.",
    { researchUrl: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/chkdsk" }
  ),
  mcCard(
    "Which Windows tool manages startup programs?",
    ["Task Manager or msconfig", "Device Manager", "Disk Management"],
    0,
    { explanation: "Task Manager (Windows 10/11) or msconfig controls startup programs.", researchUrl: "https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/system-configuration-utility-troubleshoot-configuration-errors" }
  ),
  textCard(
    "What is Safe Mode?",
    "Windows diagnostic mode that loads minimal drivers and services to troubleshoot problems.",
    { researchUrl: "https://support.microsoft.com/en-us/windows/start-your-pc-in-safe-mode-in-windows-92c27cff-db89-8644-1ce4-b3e5e56fe234" }
  ),
  mcCard(
    "How do you access Safe Mode in Windows 10/11?",
    ["Shift + Restart, or Settings > Recovery", "F8 during boot", "Delete during boot"],
    0,
    { explanation: "Hold Shift while clicking Restart, or use Settings > Recovery > Advanced Startup.", researchUrl: "https://support.microsoft.com/en-us/windows/start-your-pc-in-safe-mode-in-windows-92c27cff-db89-8644-1ce4-b3e5e56fe234" }
  ),

  // Security
  mcCard(
    "What does ESD stand for?",
    ["Electrostatic Discharge", "Electronic System Damage", "External Storage Device"],
    0,
    { explanation: "ESD can damage computer components through static electricity.", researchUrl: "https://en.wikipedia.org/wiki/Electrostatic_discharge" }
  ),
  textCard(
    "How do you prevent ESD damage?",
    "Use an anti-static wrist strap, work on anti-static mat, touch grounded metal before handling components.",
    { researchUrl: "https://en.wikipedia.org/wiki/Antistatic_device" }
  ),
  mcCard(
    "What is BitLocker?",
    ["Windows full-disk encryption", "Antivirus software", "Firewall software"],
    0,
    { explanation: "BitLocker encrypts entire drives to protect data.", researchUrl: "https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/" }
  ),
  textCard(
    "What is TPM?",
    "Trusted Platform Module - a security chip that stores encryption keys and verifies system integrity.",
    { researchUrl: "https://en.wikipedia.org/wiki/Trusted_Platform_Module" }
  ),
  mcCard(
    "What type of malware encrypts files and demands payment?",
    ["Ransomware", "Spyware", "Adware"],
    0,
    { explanation: "Ransomware encrypts your files and demands ransom for the decryption key.", researchUrl: "https://en.wikipedia.org/wiki/Ransomware" }
  ),
  mcCard(
    "What is phishing?",
    ["Fraudulent attempt to obtain sensitive information", "Virus that spreads via email", "Network scanning attack"],
    0,
    { explanation: "Phishing uses deceptive emails/websites to steal credentials.", researchUrl: "https://en.wikipedia.org/wiki/Phishing" }
  ),

  // Virtualization
  textCard(
    "What is virtualization?",
    "Running multiple operating systems on a single physical machine using a hypervisor.",
    { researchUrl: "https://en.wikipedia.org/wiki/Virtualization" }
  ),
  mcCard(
    "Which CPU feature is required for virtualization?",
    ["Intel VT-x or AMD-V", "Hyperthreading", "Overclocking support"],
    0,
    { explanation: "Hardware virtualization requires VT-x (Intel) or AMD-V (AMD) support.", researchUrl: "https://en.wikipedia.org/wiki/X86_virtualization" }
  ),
  mcCard(
    "What is a Type 1 hypervisor?",
    ["Runs directly on hardware (bare metal)", "Runs on top of an OS", "Software-only virtualization"],
    0,
    { explanation: "Type 1 (bare metal) hypervisors like ESXi run directly on hardware.", researchUrl: "https://en.wikipedia.org/wiki/Hypervisor#Classification" }
  ),
  textCard(
    "What is a Type 2 hypervisor?",
    "Runs on top of a host operating system, like VirtualBox or VMware Workstation.",
    { researchUrl: "https://en.wikipedia.org/wiki/Hypervisor#Classification" }
  ),

  // Mobile Devices
  mcCard(
    "What is the difference between GPS and cellular location?",
    ["GPS uses satellites; cellular uses tower triangulation", "They are the same", "GPS uses Wi-Fi"],
    0,
    { explanation: "GPS uses satellite signals; cellular location uses cell tower positions.", researchUrl: "https://en.wikipedia.org/wiki/Global_Positioning_System" }
  ),
  textCard(
    "What is MDM?",
    "Mobile Device Management - software to manage, secure, and control mobile devices in organizations.",
    { researchUrl: "https://en.wikipedia.org/wiki/Mobile_device_management" }
  ),
  mcCard(
    "What is a hotspot?",
    ["Device sharing its cellular connection via Wi-Fi", "Wi-Fi access point only", "Bluetooth connection"],
    0,
    { explanation: "A hotspot shares a device's cellular data connection with other devices.", researchUrl: "https://en.wikipedia.org/wiki/Hotspot_(Wi-Fi)" }
  ),

  // Troubleshooting
  textCard(
    "What are the 6 steps of troubleshooting?",
    "1) Identify problem, 2) Establish theory, 3) Test theory, 4) Plan of action, 5) Implement solution, 6) Document findings.",
    { researchUrl: "https://www.comptia.org/blog/comptia-troubleshooting-steps" }
  ),
  mcCard(
    "Computer won't POST - what should you check first?",
    ["Power connections and RAM seating", "Hard drive", "Windows updates"],
    0,
    { explanation: "No POST often means power issues or improperly seated RAM.", researchUrl: "https://en.wikipedia.org/wiki/Power-on_self-test#Progress_and_error_reporting" }
  ),
  textCard(
    "What do beep codes indicate?",
    "Hardware problems detected during POST - specific patterns indicate specific failures (varies by BIOS manufacturer).",
    { researchUrl: "https://en.wikipedia.org/wiki/Power-on_self-test#Progress_and_error_reporting" }
  ),
  mcCard(
    "Blue Screen of Death (BSOD) usually indicates:",
    ["Hardware failure or driver problem", "Software virus", "Normal Windows update"],
    0,
    { explanation: "BSODs are usually caused by faulty hardware, drivers, or system files.", researchUrl: "https://en.wikipedia.org/wiki/Blue_screen_of_death" }
  ),
  textCard(
    "What does 'bootable device not found' mean?",
    "BIOS can't find a drive with an operating system - check boot order, connections, and drive health.",
    { researchUrl: "https://support.microsoft.com/en-us/topic/advanced-troubleshooting-for-boot-problems-in-windows-3fa7c04c-8d4e-4f13-a2f8-4e5c14a8e3a3" }
  ),
],
  { researchUrl: "https://www.comptia.org/certifications/a" }
);
