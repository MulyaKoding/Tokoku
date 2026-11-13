package main

import (
	"context"
	"log"
	"time"

	"github.com/ecommerce-system/golang-api/internal/config"
	"github.com/ecommerce-system/golang-api/internal/database"
	"github.com/ecommerce-system/golang-api/internal/models"
	"github.com/ecommerce-system/golang-api/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	cfg := config.Load()

	db, err := database.ConnectMySQL(cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSL)
	if err != nil {
		log.Fatal("Gagal konek ke MySQL/TiDB:", err)
	}
	defer db.Close()

	ctx := context.Background()

	// Bersihkan data produk lama
	_, err = db.ExecContext(ctx, "DELETE FROM products")
	if err != nil {
		log.Fatalf("Gagal menghapus produk lama: %v", err)
	}
	log.Println("Data produk lama berhasil dibersihkan dari MySQL/TiDB")

	productRepo := repository.NewMySQLProductRepository(db)
	userRepo := repository.NewMySQLUserRepository(db)

	products := []models.Product{
		// === 1. KAMERA (5 ITEMS) ===
		{
			Name:        "Polaroid OneStep 2 Instant Camera",
			Category:    "Kamera",
			Price:       1850000,
			Image:       "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
			Description: "Kamera instan dengan lensa autofocus berkualitas tinggi, flash otomatis, dan desain retro legendaris.",
			Stock:       15,
			Rating:      4.7,
		},
		{
			Name:        "Sony Alpha A7 IV Mirrorless",
			Category:    "Kamera",
			Price:       34999000,
			Image:       "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
			Description: "Kamera mirrorless full-frame 33MP dengan sensor Exmor R BSI CMOS dan perekaman video 4K 60p 10-bit.",
			Stock:       8,
			Rating:      4.9,
		},
		{
			Name:        "Canon EOS R6 Mark II",
			Category:    "Kamera",
			Price:       38500000,
			Image:       "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
			Description: "Kamera profesional dengan pemotretan beruntun hingga 40 fps, stabilisasi gambar 8-stop, dan Dual Pixel CMOS AF II.",
			Stock:       6,
			Rating:      4.8,
		},
		{
			Name:        "Fujifilm X-T5 Silver Edition",
			Category:    "Kamera",
			Price:       26499000,
			Image:       "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=800&q=80",
			Description: "Kamera mirrorless sensor X-Trans CMOS 5 HR 40.2MP bergaya klasik dengan dial mekanis elegan.",
			Stock:       10,
			Rating:      4.8,
		},
		{
			Name:        "GoPro Hero 12 Black Action Cam",
			Category:    "Kamera",
			Price:       6299000,
			Image:       "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80",
			Description: "Action camera tahan air hingga 10m dengan video HDR 5.3K, HyperSmooth 6.0, dan audio Bluetooth.",
			Stock:       25,
			Rating:      4.6,
		},

		// === 2. AUDIO (5 ITEMS) ===
		{
			Name:        "Studio Headphone Pro ANC",
			Category:    "Audio",
			Price:       1450000,
			Image:       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
			Description: "Headphone over-ear nirkabel dengan Active Noise Cancelling, driver 40mm kustom, dan daya baterai 40 jam.",
			Stock:       30,
			Rating:      4.7,
		},
		{
			Name:        "Wireless Earbuds True Pro TWS",
			Category:    "Audio",
			Price:       899000,
			Image:       "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
			Description: "Earbuds TWS nirkabel dengan latensi rendah, mikrofon dual beamforming, dan case pengisian wireless.",
			Stock:       40,
			Rating:      4.5,
		},
		{
			Name:        "Retro Hi-Fi Turntable Vinyl",
			Category:    "Audio",
			Price:       2750000,
			Image:       "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
			Description: "Pemutar piringan hitam vinyl vintage dengan pre-amp internal, cartridge magnetik Audio-Technica, dan koneksi USB.",
			Stock:       12,
			Rating:      4.6,
		},
		{
			Name:        "Condenser USB Microphone Studio",
			Category:    "Audio",
			Price:       1199000,
			Image:       "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80",
			Description: "Mikrofon kondenser polar cardioid 24-bit/192kHz dengan filter pop terpasang, sempurna untuk podcast dan streaming.",
			Stock:       22,
			Rating:      4.8,
		},
		{
			Name:        "Audiophile Open-Back Headphone",
			Category:    "Audio",
			Price:       3600000,
			Image:       "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
			Description: "Headphone audiophile open-back dengan panggung suara luas, reproduksi nada netral, dan earpad velour nyaman.",
			Stock:       14,
			Rating:      4.9,
		},

		// === 3. WEARABLE (5 ITEMS) ===
		{
			Name:        "Smartwatch Fit Series 5",
			Category:    "Wearable",
			Price:       1499000,
			Image:       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
			Description: "Smartwatch pintar dengan sensor SpO2, pemantau denyut jantung 24/7, GPS mandiri, dan tahan air 5 ATM.",
			Stock:       28,
			Rating:      4.6,
		},
		{
			Name:        "Galaxy Watch Ultra Titanium",
			Category:    "Wearable",
			Price:       8499000,
			Image:       "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
			Description: "Jam pintar tangguh berbahan bodi titanium grade penerbangan, layar safir super terang, dan navigasi outdoor canggih.",
			Stock:       15,
			Rating:      4.8,
		},
		{
			Name:        "Smart Fitness Band 8 Pro",
			Category:    "Wearable",
			Price:       599000,
			Image:       "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80",
			Description: "Gelang kebugaran ramping dengan layar AMOLED 1.62 inci, 150+ mode olahraga, dan masa pakai baterai 14 hari.",
			Stock:       50,
			Rating:      4.5,
		},
		{
			Name:        "Classic Chrono Smart Hybrid",
			Category:    "Wearable",
			Price:       3250000,
			Image:       "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
			Description: "Paduan estetika jam tangan mekanik analog mewah dengan fungsi pintar notifikasi, pelacak langkah, dan denyut nadi.",
			Stock:       16,
			Rating:      4.7,
		},
		{
			Name:        "Smart Audio Glasses AR Lite",
			Category:    "Wearable",
			Price:       2199000,
			Image:       "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
			Description: "Kacamata pintar dengan speaker open-ear terintegrasi, lensa anti radiasi UV400, dan mikrofon peredam bising.",
			Stock:       18,
			Rating:      4.4,
		},

		// === 4. AKSESORI (5 ITEMS) ===
		{
			Name:        "Mechanical Keyboard RGB Custom",
			Category:    "Aksesori",
			Price:       1150000,
			Image:       "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
			Description: "Keyboard mekanik 75% hot-swappable dengan gasket mount, keycaps PBT dye-sub, dan konektivitas tri-mode wireless.",
			Stock:       35,
			Rating:      4.7,
		},
		{
			Name:        "Ergonomic Vertical Mouse Wireless",
			Category:    "Aksesori",
			Price:       499000,
			Image:       "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
			Description: "Mouse vertikal sudut 57 derajat ergonomis untuk mencegah CTS (carpal tunnel), tombol hening, dan sensor optik presisi.",
			Stock:       45,
			Rating:      4.6,
		},
		{
			Name:        "Fast Wireless Charging Stand 3-in-1",
			Category:    "Aksesori",
			Price:       389000,
			Image:       "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
			Description: "Dok pengisian nirkabel cepat Qi 15W untuk smartphone, smartwatch, dan earbuds secara simultan tanpa kabel berantakan.",
			Stock:       40,
			Rating:      4.5,
		},
		{
			Name:        "Aluminium Laptop Stand Ergonomic",
			Category:    "Aksesori",
			Price:       279000,
			Image:       "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
			Description: "Dudukan laptop berbahan full aluminium alloy dengan ventilasi pendingin optimal dan ketinggian yang dapat disesuaikan.",
			Stock:       55,
			Rating:      4.8,
		},
		{
			Name:        "USB-C Multi-Port Hub 8-in-1 100W",
			Category:    "Aksesori",
			Price:       429000,
			Image:       "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80",
			Description: "Hub multiport aluminium dengan port HDMI 4K@60Hz, slot SD/TF, 3x USB 3.0, Gigabit Ethernet, dan 100W Power Delivery.",
			Stock:       38,
			Rating:      4.6,
		},

		// === 5. LAPTOP (5 ITEMS) ===
		{
			Name:        "UltraBook 14 Pro OLED",
			Category:    "Laptop",
			Price:       13999000,
			Image:       "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
			Description: "Laptop tipis premium dengan layar 2.8K OLED 120Hz, prosesor Intel Core i7 generasi terbaru, dan RAM 16GB.",
			Stock:       12,
			Rating:      4.8,
		},
		{
			Name:        "MacBook Pro 16 M3 Max",
			Category:    "Laptop",
			Price:       42999000,
			Image:       "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
			Description: "Performa workstation portabel dengan chip Apple M3 Max, layar Liquid Retina XDR, dan baterai monster hingga 22 jam.",
			Stock:       7,
			Rating:      4.9,
		},
		{
			Name:        "Gaming Laptop ROG Strix G16",
			Category:    "Laptop",
			Price:       24500000,
			Image:       "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
			Description: "Laptop gaming bertenaga NVIDIA RTX 4070 8GB, Intel Core i9, sistem pendingin liquid metal, dan layar 240Hz Nebula.",
			Stock:       9,
			Rating:      4.7,
		},
		{
			Name:        "ThinkPad X1 Carbon Gen 11",
			Category:    "Laptop",
			Price:       26800000,
			Image:       "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
			Description: "Laptop bisnis ultra-ringan bobot 1.12kg dengan sertifikasi militer MIL-STD, keyboard legendaris, dan modem 5G LTE.",
			Stock:       11,
			Rating:      4.8,
		},
		{
			Name:        "ZenBook Duo Dual Screen 14",
			Category:    "Laptop",
			Price:       31999000,
			Image:       "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80",
			Description: "Inovasi laptop layar ganda OLED 3K 120Hz dengan keyboard Bluetooth magnetik yang dapat dilepas pasang.",
			Stock:       5,
			Rating:      4.7,
		},

		// === 6. SMARTPHONE (5 ITEMS) ===
		{
			Name:        "Smartphone X200 Pro 5G",
			Category:    "Smartphone",
			Price:       6899000,
			Image:       "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
			Description: "Flagship killer dengan prosesor Dimensity 9300, kamera Zeiss 50MP, layar AMOLED LTPO 1.5K, dan fast charge 100W.",
			Stock:       20,
			Rating:      4.6,
		},
		{
			Name:        "iPhone 15 Pro Max 256GB Titanium",
			Category:    "Smartphone",
			Price:       21999000,
			Image:       "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
			Description: "Bodi titanium tangguh berbobot ringan, Action Button kustom, chip grafis A17 Pro, dan kamera telephoto 5x optical zoom.",
			Stock:       14,
			Rating:      4.9,
		},
		{
			Name:        "Galaxy Z Fold 5 5G Phantom Black",
			Category:    "Smartphone",
			Price:       23499000,
			Image:       "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
			Description: "Ponsel lipat produktivitas tanpa celah engsel Flex Hinge, multitasking 3 jendela aplikasi, dan dukungan S Pen.",
			Stock:       10,
			Rating:      4.7,
		},
		{
			Name:        "Google Pixel 8 Pro AI Camera",
			Category:    "Smartphone",
			Price:       15499000,
			Image:       "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
			Description: "Kamera komputasional bertenaga Google Tensor G3, fitur AI Best Take dan Magic Audio Eraser, serta pembaruan OS 7 tahun.",
			Stock:       12,
			Rating:      4.8,
		},
		{
			Name:        "Nothing Phone (2) Glyph Edition",
			Category:    "Smartphone",
			Price:       8799000,
			Image:       "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&q=80",
			Description: "Desain bodi transparan ikonik dengan lampu antarmuka Glyph interaktif, Snapdragon 8+ Gen 1, dan Nothing OS bersih.",
			Stock:       16,
			Rating:      4.5,
		},

		// === 7. GAMING (5 ITEMS) ===
		{
			Name:        "Gamepad Elite Wireless Controller",
			Category:    "Gaming",
			Price:       1299000,
			Image:       "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=800&q=80",
			Description: "Kontroler nirkabel presisi dengan thumbstick yang dapat ditukar, paddle belakang, hair trigger locks, dan baterai 40 jam.",
			Stock:       32,
			Rating:      4.7,
		},
		{
			Name:        "PlayStation 5 Slim Digital Console",
			Category:    "Gaming",
			Price:       7699000,
			Image:       "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
			Description: "Konsol generasi terbaru dengan SSD ultra cepat 1TB, grafis ray tracing 4K 120Hz, dan kontroler DualSense haptic feedback.",
			Stock:       15,
			Rating:      4.9,
		},
		{
			Name:        "VR Headset Virtual Reality 4K",
			Category:    "Gaming",
			Price:       6890000,
			Image:       "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&q=80",
			Description: "Kacamata VR resolusi 4K dengan pelacak gerak inside-out 6DoF, lensa pancake tajam, dan perpustakaan game tanpa kabel.",
			Stock:       11,
			Rating:      4.6,
		},
		{
			Name:        "Retro Arcade Arcade Stick Pro",
			Category:    "Gaming",
			Price:       1650000,
			Image:       "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
			Description: "Fight stick arkade dengan komponen asli Sanwa Denshi, respons instan nol latensi, dan kompatibilitas PC & konsol.",
			Stock:       18,
			Rating:      4.5,
		},
		{
			Name:        "Nintendo Switch OLED Neon Console",
			Category:    "Gaming",
			Price:       4150000,
			Image:       "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80",
			Description: "Konsol hybrid fleksibel dengan layar OLED 7 inci warna cerah, penyangga lebar yang dapat diatur, dan audio jernih.",
			Stock:       24,
			Rating:      4.8,
		},

		// === 8. SPEAKER (5 ITEMS) ===
		{
			Name:        "Portable Speaker Boom IPX7",
			Category:    "Speaker",
			Price:       750000,
			Image:       "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
			Description: "Speaker Bluetooth tahan banting dan anti air IPX7 dengan suara 360 derajat bertenaga dan baterai tahan 16 jam.",
			Stock:       35,
			Rating:      4.6,
		},
		{
			Name:        "Smart Home Speaker Voice Assistant",
			Category:    "Speaker",
			Price:       890000,
			Image:       "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
			Description: "Speaker pintar pengontrol smart home dengan asisten suara otomatis, audio definisi tinggi, dan mikrofon far-field sensitif.",
			Stock:       26,
			Rating:      4.5,
		},
		{
			Name:        "Marshall Acton III Bluetooth Speaker",
			Category:    "Speaker",
			Price:       4590000,
			Image:       "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
			Description: "Speaker home audio bergaya vintage ikonik dengan soundstage lebih lebar dan kontrol analog khas Marshall.",
			Stock:       14,
			Rating:      4.9,
		},
		{
			Name:        "Soundbar Cinema 5.1 Dolby Atmos",
			Category:    "Speaker",
			Price:       3899000,
			Image:       "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
			Description: "Sistem audio bioskop rumah dengan surround sound 5.1 kanal, subwoofer nirkabel berdentum, dan port eARC.",
			Stock:       12,
			Rating:      4.7,
		},
		{
			Name:        "Mini Waterproof Clip Bluetooth Speaker",
			Category:    "Speaker",
			Price:       399000,
			Image:       "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80",
			Description: "Speaker saku mungil dengan klip carabiner terintegrasi, tahan debu & air IP67, siap diajak bertualang outdoor.",
			Stock:       45,
			Rating:      4.4,
		},

		// === 9. DRONE (5 ITEMS) ===
		{
			Name:        "AeroDrone 4K Pro Gimbal 3-Axis",
			Category:    "Drone",
			Price:       7499000,
			Image:       "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
			Description: "Drone kamera 4K 60fps dengan sensor 1/1.3 inci, gimbal mekanis 3-axis, dan transmisi video digital 10km.",
			Stock:       9,
			Rating:      4.7,
		},
		{
			Name:        "DJI Mini 3 Lightweight Foldable Drone",
			Category:    "Drone",
			Price:       5899000,
			Image:       "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80",
			Description: "Drone ringkas di bawah 249 gram tanpa perlu lisensi rumit, fitur True Vertical Shooting untuk medsos, dan terbang 38 menit.",
			Stock:       15,
			Rating:      4.8,
		},
		{
			Name:        "FPV Racing Drone Carbon Frame",
			Category:    "Drone",
			Price:       4250000,
			Image:       "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80",
			Description: "Drone balap FPV kecepatan tinggi hingga 140km/jam dengan rangka serat karbon 3K dan kamera video ultra-rendah latensi.",
			Stock:       10,
			Rating:      4.5,
		},
		{
			Name:        "Professional Aerial Drone Cinema 6K",
			Category:    "Drone",
			Price:       28500000,
			Image:       "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
			Description: "Drone sinematografi profesional dengan kamera sensor Full Frame 6K, CinemaDNG RAW, dan sensor penghindar rintangan omnidirectional.",
			Stock:       4,
			Rating:      4.9,
		},
		{
			Name:        "Pocket Foldable Selfie Drone GPS",
			Category:    "Drone",
			Price:       2199000,
			Image:       "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?w=800&q=80",
			Description: "Drone lipat seukuran telapak tangan dengan fitur pelacakan wajah cerdas, kontrol gestur tangan, dan auto return-to-home.",
			Stock:       22,
			Rating:      4.3,
		},

		// === 10. MONITOR (5 ITEMS) ===
		{
			Name:        `Monitor UltraWide 34" QHD Curved`,
			Category:    "Monitor",
			Price:       5850000,
			Image:       "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
			Description: "Layar lengkung 1500R rasio 21:9 resolusi UWQHD 3440x1440, refresh rate 144Hz, dan 99% sRGB untuk produktivitas maksimal.",
			Stock:       12,
			Rating:      4.8,
		},
		{
			Name:        `Curved Gaming Monitor 27" 240Hz`,
			Category:    "Monitor",
			Price:       4299000,
			Image:       "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800&q=80",
			Description: "Monitor gaming e-sports dengan respon waktu 0.5ms MPRT, refresh rate kilat 240Hz, dan teknologi AMD FreeSync Premium.",
			Stock:       16,
			Rating:      4.7,
		},
		{
			Name:        `Portable Monitor 15.6" IPS Type-C`,
			Category:    "Monitor",
			Price:       1799000,
			Image:       "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800&q=80",
			Description: "Monitor portabel ultra tipis dengan bobot 700g, resolusi Full HD IPS, plug-and-play satu kabel Type-C untuk laptop & smartphone.",
			Stock:       25,
			Rating:      4.6,
		},
		{
			Name:        `Studio Display 27" 4K HDR Color Pro`,
			Category:    "Monitor",
			Price:       9890000,
			Image:       "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80",
			Description: "Monitor kalibrasi pabrik Delta E < 1 dengan cakupan 99% DCI-P3, panel IPS Black 4K, dan pengisian daya laptop 90W USB-C.",
			Stock:       8,
			Rating:      4.9,
		},
		{
			Name:        `Dual Monitor Setup Stand 24" Frameless`,
			Category:    "Monitor",
			Price:       2650000,
			Image:       "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
			Description: "Monitor bezel-less 24 inci IPS 100Hz dengan teknologi Eye Care flicker-free dan dudukan VESA ergonomis.",
			Stock:       20,
			Rating:      4.6,
		},
	}

	for _, p := range products {
		if err := productRepo.Create(ctx, &p); err != nil {
			log.Fatalf("Gagal insert produk %s: %v", p.Name, err)
		}
	}
	log.Printf("Berhasil insert %d produk ke MySQL/TiDB\n", len(products))

	// Pastikan user admin dan demo user tetap ada
	var userCount int
	_ = db.QueryRowContext(ctx, "SELECT COUNT(*) FROM users").Scan(&userCount)
	if userCount == 0 {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
		users := []models.User{
			{
				Name:       "Administrator TokoKu",
				Email:      "admin@tokoku.com",
				Password:   string(hashedPassword),
				Role:       "admin",
				Avatar:     "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
				IsVerified: true,
				CreatedAt:  time.Now(),
				UpdatedAt:  time.Now(),
			},
			{
				Name:       "Budi Santoso",
				Email:      "budi@tokoku.com",
				Password:   string(hashedPassword),
				Role:       "user",
				Avatar:     "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
				IsVerified: true,
				CreatedAt:  time.Now(),
				UpdatedAt:  time.Now(),
			},
		}

		for _, u := range users {
			if err := userRepo.Create(ctx, &u); err != nil {
				log.Printf("Catatan insert user %s: %v", u.Email, err)
			}
		}
		log.Printf("Berhasil inisialisasi default users\n")
	}
}
