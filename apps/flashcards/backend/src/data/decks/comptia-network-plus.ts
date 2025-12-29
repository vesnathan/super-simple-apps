import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const compTIANetworkPlus: SeedDeck = createDeck(
  "a1b2c3d4-1111-4000-8000-000000000004",
  "CompTIA Network+ Essentials",
  "Prepare for CompTIA Network+ certification. Covers the OSI model, TCP/IP, network devices, wireless technologies, network security, troubleshooting, and infrastructure concepts.",
  ["it", "it-certifications", "networking", "certification", "cybersecurity"],
  [
  // OSI Model
  mcCard(
    "How many layers are in the OSI model?",
    ["7", "4", "5"],
    0,
    { explanation: "The OSI model has 7 layers from Physical to Application.", researchUrl: "https://en.wikipedia.org/wiki/OSI_model" }
  ),
  mcCard(
    "What is Layer 1 of the OSI model?",
    ["Physical", "Data Link", "Network"],
    0,
    { explanation: "Layer 1 (Physical) handles electrical signals, cables, and hardware.", researchUrl: "https://en.wikipedia.org/wiki/Physical_layer" }
  ),
  mcCard(
    "What is Layer 2 of the OSI model?",
    ["Data Link", "Network", "Physical"],
    0,
    { explanation: "Layer 2 (Data Link) handles MAC addresses, switches, and frames.", researchUrl: "https://en.wikipedia.org/wiki/Data_link_layer" }
  ),
  mcCard(
    "What is Layer 3 of the OSI model?",
    ["Network", "Transport", "Data Link"],
    0,
    { explanation: "Layer 3 (Network) handles IP addresses, routing, and packets.", researchUrl: "https://en.wikipedia.org/wiki/Network_layer" }
  ),
  mcCard(
    "What is Layer 4 of the OSI model?",
    ["Transport", "Session", "Network"],
    0,
    { explanation: "Layer 4 (Transport) handles TCP/UDP, ports, and segments.", researchUrl: "https://en.wikipedia.org/wiki/Transport_layer" }
  ),
  textCard(
    "What are Layers 5, 6, and 7 of the OSI model?",
    "Layer 5: Session (connections), Layer 6: Presentation (encryption/formatting), Layer 7: Application (HTTP, FTP, etc.)",
    { researchUrl: "https://en.wikipedia.org/wiki/OSI_model#Layer_architecture" }
  ),
  mcCard(
    "Which OSI layer do switches operate at?",
    ["Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 1 (Physical)"],
    0,
    { explanation: "Switches use MAC addresses to forward frames at Layer 2.", researchUrl: "https://en.wikipedia.org/wiki/Network_switch" }
  ),
  mcCard(
    "Which OSI layer do routers operate at?",
    ["Layer 3 (Network)", "Layer 2 (Data Link)", "Layer 4 (Transport)"],
    0,
    { explanation: "Routers use IP addresses to route packets at Layer 3.", researchUrl: "https://en.wikipedia.org/wiki/Router_(computing)" }
  ),

  // TCP/IP Model
  mcCard(
    "How many layers are in the TCP/IP model?",
    ["4", "7", "5"],
    0,
    { explanation: "TCP/IP has 4 layers: Network Access, Internet, Transport, Application.", researchUrl: "https://en.wikipedia.org/wiki/Internet_protocol_suite" }
  ),
  textCard(
    "What are the 4 layers of the TCP/IP model?",
    "1) Network Access (Physical+Data Link), 2) Internet (Network), 3) Transport, 4) Application",
    { researchUrl: "https://en.wikipedia.org/wiki/Internet_protocol_suite#Layer_names_and_number_of_layers_in_the_literature" }
  ),

  // IP Addressing
  mcCard(
    "What is the default subnet mask for a Class A network?",
    ["255.0.0.0", "255.255.0.0", "255.255.255.0"],
    0,
    { explanation: "Class A networks use /8 or 255.0.0.0 by default.", researchUrl: "https://en.wikipedia.org/wiki/Classful_network#Classful_addressing_definition" }
  ),
  mcCard(
    "What is the default subnet mask for a Class B network?",
    ["255.255.0.0", "255.0.0.0", "255.255.255.0"],
    0,
    { explanation: "Class B networks use /16 or 255.255.0.0 by default.", researchUrl: "https://en.wikipedia.org/wiki/Classful_network#Classful_addressing_definition" }
  ),
  mcCard(
    "What is the default subnet mask for a Class C network?",
    ["255.255.255.0", "255.255.0.0", "255.0.0.0"],
    0,
    { explanation: "Class C networks use /24 or 255.255.255.0 by default.", researchUrl: "https://en.wikipedia.org/wiki/Classful_network#Classful_addressing_definition" }
  ),
  mcCard(
    "Which IP address range is Class A?",
    ["1.0.0.0 - 126.255.255.255", "128.0.0.0 - 191.255.255.255", "192.0.0.0 - 223.255.255.255"],
    0,
    { explanation: "Class A ranges from 1-126 in the first octet.", researchUrl: "https://en.wikipedia.org/wiki/Classful_network" }
  ),
  mcCard(
    "Which IP address is a private Class A address?",
    ["10.x.x.x", "172.16.x.x", "192.168.x.x"],
    0,
    { explanation: "10.0.0.0 to 10.255.255.255 is the private Class A range.", researchUrl: "https://en.wikipedia.org/wiki/Private_network" }
  ),
  mcCard(
    "Which IP range is private for Class B?",
    ["172.16.0.0 - 172.31.255.255", "10.0.0.0 - 10.255.255.255", "192.168.0.0 - 192.168.255.255"],
    0,
    { explanation: "Private Class B ranges from 172.16.0.0 to 172.31.255.255.", researchUrl: "https://en.wikipedia.org/wiki/Private_network" }
  ),
  mcCard(
    "Which IP range is private for Class C?",
    ["192.168.0.0 - 192.168.255.255", "172.16.0.0 - 172.31.255.255", "10.0.0.0 - 10.255.255.255"],
    0,
    { explanation: "Private Class C is 192.168.0.0 to 192.168.255.255.", researchUrl: "https://en.wikipedia.org/wiki/Private_network" }
  ),
  textCard(
    "What is APIPA?",
    "Automatic Private IP Addressing - 169.254.x.x range assigned when DHCP fails.",
    { researchUrl: "https://en.wikipedia.org/wiki/Link-local_address#IPv4" }
  ),
  mcCard(
    "What is the loopback address?",
    ["127.0.0.1", "0.0.0.0", "255.255.255.255"],
    0,
    { explanation: "127.0.0.1 is the loopback address, used to test local TCP/IP stack.", researchUrl: "https://en.wikipedia.org/wiki/Localhost" }
  ),

  // Subnetting
  mcCard(
    "How many usable hosts in a /24 network?",
    ["254", "256", "255"],
    0,
    { explanation: "/24 has 256 addresses minus 2 (network and broadcast) = 254 usable.", researchUrl: "https://en.wikipedia.org/wiki/Subnetwork" }
  ),
  mcCard(
    "What is CIDR notation /25 equivalent to in subnet mask?",
    ["255.255.255.128", "255.255.255.192", "255.255.255.0"],
    0,
    { explanation: "/25 means 25 bits for network, leaving 7 for hosts (128 addresses).", researchUrl: "https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing" }
  ),
  textCard(
    "How do you calculate the number of hosts in a subnet?",
    "2^(32-prefix) - 2. Subtract 2 for network address and broadcast address.",
    { researchUrl: "https://en.wikipedia.org/wiki/Subnetwork#Subnetting" }
  ),

  // IPv6
  mcCard(
    "How long is an IPv6 address?",
    ["128 bits", "32 bits", "64 bits"],
    0,
    { explanation: "IPv6 addresses are 128 bits (vs 32 bits for IPv4).", researchUrl: "https://en.wikipedia.org/wiki/IPv6_address" }
  ),
  textCard(
    "What does an IPv6 address look like?",
    "Eight groups of four hexadecimal digits separated by colons, e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334",
    { researchUrl: "https://en.wikipedia.org/wiki/IPv6_address#Representation" }
  ),
  mcCard(
    "What is the IPv6 loopback address?",
    ["::1", "0000:0000:0000:0001", "127.0.0.1"],
    0,
    { explanation: "::1 is the IPv6 loopback address.", researchUrl: "https://en.wikipedia.org/wiki/IPv6_address#Special_addresses" }
  ),

  // Ports
  mcCard(
    "What port does HTTP use?",
    ["80", "443", "21"],
    0,
    { explanation: "HTTP uses port 80 by default.", researchUrl: "https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol" }
  ),
  mcCard(
    "What port does HTTPS use?",
    ["443", "80", "22"],
    0,
    { explanation: "HTTPS uses port 443 by default.", researchUrl: "https://en.wikipedia.org/wiki/HTTPS" }
  ),
  mcCard(
    "What port does FTP use for control?",
    ["21", "20", "22"],
    0,
    { explanation: "FTP uses port 21 for control and port 20 for data transfer.", researchUrl: "https://en.wikipedia.org/wiki/File_Transfer_Protocol" }
  ),
  mcCard(
    "What port does SSH use?",
    ["22", "23", "21"],
    0,
    { explanation: "SSH uses port 22 for secure remote access.", researchUrl: "https://en.wikipedia.org/wiki/Secure_Shell" }
  ),
  mcCard(
    "What port does Telnet use?",
    ["23", "22", "25"],
    0,
    { explanation: "Telnet uses port 23 (insecure, use SSH instead).", researchUrl: "https://en.wikipedia.org/wiki/Telnet" }
  ),
  mcCard(
    "What port does DNS use?",
    ["53", "80", "25"],
    0,
    { explanation: "DNS uses port 53 for both TCP and UDP.", researchUrl: "https://en.wikipedia.org/wiki/Domain_Name_System" }
  ),
  mcCard(
    "What port does SMTP use?",
    ["25", "110", "143"],
    0,
    { explanation: "SMTP (sending email) uses port 25.", researchUrl: "https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol" }
  ),
  mcCard(
    "What port does POP3 use?",
    ["110", "143", "25"],
    0,
    { explanation: "POP3 (receiving email) uses port 110.", researchUrl: "https://en.wikipedia.org/wiki/Post_Office_Protocol" }
  ),
  mcCard(
    "What port does IMAP use?",
    ["143", "110", "25"],
    0,
    { explanation: "IMAP (receiving email) uses port 143.", researchUrl: "https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol" }
  ),
  mcCard(
    "What port does RDP use?",
    ["3389", "22", "23"],
    0,
    { explanation: "Remote Desktop Protocol uses port 3389.", researchUrl: "https://en.wikipedia.org/wiki/Remote_Desktop_Protocol" }
  ),
  mcCard(
    "What port does DHCP use?",
    ["67 and 68", "53", "80"],
    0,
    { explanation: "DHCP uses port 67 (server) and 68 (client).", researchUrl: "https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol" }
  ),
  mcCard(
    "What port does SNMP use?",
    ["161 and 162", "25", "110"],
    0,
    { explanation: "SNMP uses port 161 (agent) and 162 (manager traps).", researchUrl: "https://en.wikipedia.org/wiki/Simple_Network_Management_Protocol" }
  ),

  // Protocols
  textCard(
    "What does TCP provide that UDP doesn't?",
    "Reliable, ordered delivery with acknowledgments, error checking, and retransmission.",
    { researchUrl: "https://en.wikipedia.org/wiki/Transmission_Control_Protocol" }
  ),
  mcCard(
    "Which protocol is connectionless?",
    ["UDP", "TCP", "Both"],
    0,
    { explanation: "UDP is connectionless - no handshake or guaranteed delivery.", researchUrl: "https://en.wikipedia.org/wiki/User_Datagram_Protocol" }
  ),
  textCard(
    "What is the TCP three-way handshake?",
    "SYN -> SYN-ACK -> ACK. Used to establish a TCP connection.",
    { researchUrl: "https://en.wikipedia.org/wiki/Transmission_Control_Protocol#Connection_establishment" }
  ),
  mcCard(
    "What does DHCP do?",
    ["Automatically assigns IP addresses", "Resolves hostnames to IPs", "Routes packets"],
    0,
    { explanation: "Dynamic Host Configuration Protocol assigns IP addresses dynamically.", researchUrl: "https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol" }
  ),
  mcCard(
    "What does DNS do?",
    ["Resolves domain names to IP addresses", "Assigns IP addresses", "Encrypts traffic"],
    0,
    { explanation: "Domain Name System translates names like google.com to IP addresses.", researchUrl: "https://en.wikipedia.org/wiki/Domain_Name_System" }
  ),
  mcCard(
    "What does ARP do?",
    ["Resolves IP addresses to MAC addresses", "Resolves names to IPs", "Assigns IPs"],
    0,
    { explanation: "Address Resolution Protocol maps IP addresses to MAC addresses on a LAN.", researchUrl: "https://en.wikipedia.org/wiki/Address_Resolution_Protocol" }
  ),
  mcCard(
    "What does NAT do?",
    ["Translates private IPs to public IPs", "Assigns IP addresses", "Encrypts traffic"],
    0,
    { explanation: "Network Address Translation allows private network devices to access the internet.", researchUrl: "https://en.wikipedia.org/wiki/Network_address_translation" }
  ),
  textCard(
    "What is PAT?",
    "Port Address Translation - a type of NAT that uses port numbers to map multiple private IPs to one public IP.",
    { researchUrl: "https://en.wikipedia.org/wiki/Network_address_translation#NAPT" }
  ),
  mcCard(
    "What does ICMP do?",
    ["Sends error and control messages (ping)", "Transfers files", "Resolves names"],
    0,
    { explanation: "Internet Control Message Protocol is used for ping, traceroute, and error messages.", researchUrl: "https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol" }
  ),

  // Network Devices
  mcCard(
    "What device connects multiple networks together?",
    ["Router", "Switch", "Hub"],
    0,
    { explanation: "Routers connect different networks and route traffic between them.", researchUrl: "https://en.wikipedia.org/wiki/Router_(computing)" }
  ),
  mcCard(
    "What device connects multiple devices in the same network?",
    ["Switch", "Router", "Modem"],
    0,
    { explanation: "Switches connect devices within a LAN using MAC addresses.", researchUrl: "https://en.wikipedia.org/wiki/Network_switch" }
  ),
  textCard(
    "What is the difference between a managed and unmanaged switch?",
    "Managed switches allow configuration (VLANs, QoS, monitoring). Unmanaged are plug-and-play with no configuration.",
    { researchUrl: "https://en.wikipedia.org/wiki/Network_switch#Managed_vs._unmanaged" }
  ),
  textCard(
    "What is a firewall?",
    "A security device that filters network traffic based on rules, blocking unauthorized access.",
    { researchUrl: "https://en.wikipedia.org/wiki/Firewall_(computing)" }
  ),
  mcCard(
    "What is a VLAN?",
    ["Virtual LAN that segments a network logically", "Very Large Area Network", "Virtual Link Access Node"],
    0,
    { explanation: "VLANs segment networks without physical separation.", researchUrl: "https://en.wikipedia.org/wiki/VLAN" }
  ),

  // Wireless
  mcCard(
    "What is the most common Wi-Fi frequency band?",
    ["2.4 GHz and 5 GHz", "900 MHz", "60 GHz"],
    0,
    { explanation: "Most Wi-Fi uses 2.4 GHz (longer range) and 5 GHz (faster, less interference).", researchUrl: "https://en.wikipedia.org/wiki/Wi-Fi#Radio_spectrum" }
  ),
  mcCard(
    "What Wi-Fi standard is 802.11ac?",
    ["Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 4"],
    0,
    { explanation: "802.11ac is also known as Wi-Fi 5.", researchUrl: "https://en.wikipedia.org/wiki/IEEE_802.11ac" }
  ),
  mcCard(
    "What Wi-Fi standard is 802.11ax?",
    ["Wi-Fi 6", "Wi-Fi 5", "Wi-Fi 4"],
    0,
    { explanation: "802.11ax is also known as Wi-Fi 6.", researchUrl: "https://en.wikipedia.org/wiki/IEEE_802.11ax" }
  ),
  mcCard(
    "What is the best Wi-Fi security protocol currently?",
    ["WPA3", "WPA2", "WEP"],
    0,
    { explanation: "WPA3 is the current most secure wireless security protocol.", researchUrl: "https://en.wikipedia.org/wiki/WPA3" }
  ),
  textCard(
    "Why is WEP insecure?",
    "WEP uses weak encryption that can be cracked in minutes. Never use WEP.",
    { researchUrl: "https://en.wikipedia.org/wiki/Wired_Equivalent_Privacy#Security" }
  ),
  textCard(
    "What is an SSID?",
    "Service Set Identifier - the name of a wireless network.",
    { researchUrl: "https://en.wikipedia.org/wiki/Service_set_(802.11_network)#SSID" }
  ),

  // Cables and Connectors
  mcCard(
    "What is the maximum length of a Cat5e/Cat6 cable?",
    ["100 meters", "50 meters", "300 meters"],
    0,
    { explanation: "Ethernet cables have a maximum reliable length of 100 meters.", researchUrl: "https://en.wikipedia.org/wiki/Ethernet_over_twisted_pair#Cable_lengths" }
  ),
  mcCard(
    "What connector does Ethernet use?",
    ["RJ-45", "RJ-11", "BNC"],
    0,
    { explanation: "RJ-45 is the standard Ethernet connector.", researchUrl: "https://en.wikipedia.org/wiki/Modular_connector#8P8C" }
  ),
  mcCard(
    "What is Cat6 cable rated for?",
    ["Up to 10 Gbps (short distances)", "100 Mbps", "1 Gbps only"],
    0,
    { explanation: "Cat6 supports 10 Gbps up to 55 meters, 1 Gbps up to 100 meters.", researchUrl: "https://en.wikipedia.org/wiki/Category_6_cable" }
  ),
  textCard(
    "What is the difference between straight-through and crossover cables?",
    "Straight-through connects different devices (PC to switch). Crossover connects similar devices (PC to PC). Modern devices auto-detect.",
    { researchUrl: "https://en.wikipedia.org/wiki/Ethernet_crossover_cable" }
  ),
  mcCard(
    "What type of cable is immune to EMI?",
    ["Fiber optic", "Cat5e", "Coaxial"],
    0,
    { explanation: "Fiber optic uses light, making it immune to electromagnetic interference.", researchUrl: "https://en.wikipedia.org/wiki/Fiber-optic_cable" }
  ),
  textCard(
    "What are the two types of fiber optic cable?",
    "Single-mode (long distance, smaller core) and Multi-mode (shorter distance, larger core).",
    { researchUrl: "https://en.wikipedia.org/wiki/Optical_fiber#Multi-mode_fiber" }
  ),

  // Network Troubleshooting
  mcCard(
    "What command tests connectivity to another host?",
    ["ping", "tracert", "netstat"],
    0,
    { explanation: "Ping sends ICMP echo requests to test if a host is reachable.", researchUrl: "https://en.wikipedia.org/wiki/Ping_(networking_utility)" }
  ),
  mcCard(
    "What command shows the path packets take to a destination?",
    ["tracert/traceroute", "ping", "ipconfig"],
    0,
    { explanation: "Tracert (Windows) or traceroute (Linux) shows the route to a host.", researchUrl: "https://en.wikipedia.org/wiki/Traceroute" }
  ),
  mcCard(
    "What command shows current IP configuration?",
    ["ipconfig (Windows) / ifconfig (Linux)", "netstat", "ping"],
    0,
    { explanation: "ipconfig/ifconfig displays IP address, subnet mask, and gateway.", researchUrl: "https://en.wikipedia.org/wiki/Ipconfig" }
  ),
  mcCard(
    "What command shows active network connections?",
    ["netstat", "ping", "ipconfig"],
    0,
    { explanation: "Netstat shows active connections, listening ports, and network statistics.", researchUrl: "https://en.wikipedia.org/wiki/Netstat" }
  ),
  textCard(
    "What does nslookup do?",
    "Queries DNS servers to resolve domain names to IP addresses or vice versa.",
    { researchUrl: "https://en.wikipedia.org/wiki/Nslookup" }
  ),
  textCard(
    "What is the purpose of ipconfig /release and /renew?",
    "Releases the current DHCP lease and requests a new IP address from the DHCP server.",
    { researchUrl: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig" }
  ),

  // Security
  mcCard(
    "What type of attack floods a network with traffic?",
    ["DDoS (Distributed Denial of Service)", "Phishing", "Man-in-the-middle"],
    0,
    { explanation: "DDoS attacks overwhelm servers or networks with massive traffic.", researchUrl: "https://en.wikipedia.org/wiki/Denial-of-service_attack" }
  ),
  textCard(
    "What is a man-in-the-middle attack?",
    "Attacker secretly intercepts and possibly alters communication between two parties.",
    { researchUrl: "https://en.wikipedia.org/wiki/Man-in-the-middle_attack" }
  ),
  mcCard(
    "What is the purpose of a VPN?",
    ["Create encrypted tunnel for secure remote access", "Speed up internet", "Block viruses"],
    0,
    { explanation: "VPNs encrypt traffic and allow secure access to private networks.", researchUrl: "https://en.wikipedia.org/wiki/Virtual_private_network" }
  ),
  textCard(
    "What is 802.1X?",
    "Port-based network access control that requires authentication before allowing network access.",
    { researchUrl: "https://en.wikipedia.org/wiki/IEEE_802.1X" }
  ),
  mcCard(
    "What is the purpose of an IDS?",
    ["Detect and alert on suspicious network activity", "Block attacks automatically", "Encrypt traffic"],
    0,
    { explanation: "Intrusion Detection System monitors and alerts but doesn't block.", researchUrl: "https://en.wikipedia.org/wiki/Intrusion_detection_system" }
  ),
  mcCard(
    "What is the purpose of an IPS?",
    ["Detect and block suspicious network activity", "Only detect attacks", "Encrypt traffic"],
    0,
    { explanation: "Intrusion Prevention System both detects and blocks threats.", researchUrl: "https://en.wikipedia.org/wiki/Intrusion_detection_system#Intrusion_prevention" }
  ),

  // Network Services
  textCard(
    "What is a proxy server?",
    "Acts as an intermediary between clients and servers, can cache content and filter traffic.",
    { researchUrl: "https://en.wikipedia.org/wiki/Proxy_server" }
  ),
  textCard(
    "What is load balancing?",
    "Distributes network traffic across multiple servers to ensure availability and performance.",
    { researchUrl: "https://en.wikipedia.org/wiki/Load_balancing_(computing)" }
  ),
  mcCard(
    "What is QoS?",
    ["Quality of Service - prioritizes certain traffic", "Quick Operating System", "Query on Server"],
    0,
    { explanation: "QoS prioritizes important traffic like VoIP over less critical traffic.", researchUrl: "https://en.wikipedia.org/wiki/Quality_of_service" }
  ),
],
  { researchUrl: "https://www.comptia.org/certifications/network" }
);
