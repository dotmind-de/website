import type { LocaleContent } from "../content-types";

export const tr: LocaleContent = {
  profile: {
    expertise: [
      {
        title: "Yazılım Mühendisliği",
        statement: "Temel. Yapılandırılmış problem çözme, temiz mimari ve yayından sonra da bakımı kolay kalan kod.",
        capabilities: [
          "Yazılım geliştirme",
          "Web uygulaması geliştirme",
          "Frontend geliştirme",
          "Projenin gerektirdiği yerde backend & API",
          "Modern geliştirme iş akışları",
          "Yapay zekâ destekli geliştirme",
        ],
      },
      {
        title: "Yapay Zekâ",
        statement: "Çarpan. Ürünün tüm yaşam döngüsünde yapay zekâ — tasarım ve geliştirmeden pazarlamaya ve akıllı ev teknolojisine.",
        capabilities: [
          "Yapay zekâ destekli web siteleri & uygulamalar",
          "UI/UX tasarımında yapay zekâ",
          "Yapay zekâ destekli geliştirme",
          "Pazarlama & içerik için yapay zekâ",
          "Akıllı ev teknolojisi",
          "Akıllı otomasyon",
        ],
      },
      {
        title: "Web & Uygulama Geliştirme",
        statement: "Günlük pratik. Detaya ve performansa özen gösterilerek geliştirilen hızlı, duyarlı web siteleri ve uygulamalar.",
        capabilities: [
          "Modern duyarlı web siteleri",
          "Web uygulamaları",
          "Web & uygulama tasarımı",
          "Arayüz uygulaması",
          "Performans",
          "SEO odaklı geliştirme",
          "Etkileşimli deneyimler",
        ],
      },
      {
        title: "Dijital Pazarlama",
        statement: "Stratejik bakış. Hedef kitle, mesaj ve dönüşüm yolu ilk günden itibaren düşünülerek inşa etmek.",
        capabilities: ["Dijital strateji", "Sosyal medya", "İçerik", "SEO", "Dönüşüm odaklı düşünme", "Online varlık"],
      },
    ],
    aiDomains: [
      {
        title: "Tasarım",
        kicker: "Yapay zekâ × UI/UX",
        description: "Araştırma, keşif ve prototiplemeyi yapay zekâyla hızlandırmak — ve yapay zekânın deneyimin parçası olduğu web siteleri ile uygulamalar tasarlamak.",
        points: ["Yapay zekâ destekli UI/UX tasarımı", "Hızlı prototipleme", "Yapay zekâ destekli ürün deneyimleri"],
      },
      {
        title: "Geliştirme",
        kicker: "Yapay zekâ × Mühendislik",
        description: "Web sitelerine ve uygulamalara yapay zekâ özellikleri eklemek; insan kontrolünde kalan yapay zekâ destekli iş akışlarıyla.",
        points: ["Web sitelerinde & uygulamalarda yapay zekâ", "Yapay zekâ destekli geliştirme", "Otomasyon & entegrasyonlar"],
      },
      {
        title: "Pazarlama",
        kicker: "Yapay zekâ × Büyüme",
        description: "İçerikte, hedef kitle analizinde ve kampanyalarda yapay zekâ — böylece inşa edilen doğru insanlara ulaşır.",
        points: ["Yapay zekâ destekli içerik", "Hedef kitle içgörüsü", "Kampanya optimizasyonu"],
      },
      {
        title: "Akıllı Ev",
        kicker: "Yapay zekâ × Fiziksel alan",
        description: "Cihazları, verileri ve arayüzleri, yaşaması kolay hissettiren akıllı ev deneyimlerinde birleştirmek.",
        points: ["Akıllı ev teknolojisi", "Bağlı cihazlar", "Akıllı otomasyon"],
      },
    ],
    process: [
      { title: "Anlamak", description: "Hedefler, kitle, kısıtlar ve başarının neye benzemesi gerektiği." },
      { title: "Planlamak", description: "Kapsam, yapı, içerik ve teknik yaklaşım — geliştirmeye başlamadan üzerinde anlaşılır." },
      { title: "Tasarlamak", description: "Arayüz, hiyerarşi ve etkileşim — yapay zekâ destekli prototiplerle daha hızlı keşfedilir." },
      { title: "Geliştirmek", description: "Temiz, erişilebilir uygulama — yapay zekâ destekli, insan kontrolünde, küçük adımlarla teslim." },
      { title: "İyileştirmek", description: "Tüm cihazlarda test, performans ayarı ve detayların cilalanması." },
      { title: "Yayına almak", description: "Yayın, SEO temelleri ve gerçekten sürdürebileceğiniz bir devir teslim." },
    ],
    journey: [
      { title: "Yazılım Mühendisliği", context: "Üniversite", description: "Yazılım mühendisliği eğitimi — sonrasındaki her şeyin temeli." },
      { title: "Mesleki eğitim", context: "Almanya", description: "Yazılım mühendisliği ve geliştirme alanında yaklaşık bir yıllık ek mesleki eğitim." },
      { title: "Web Geliştirme", context: "Profesyonel iş", description: "Web geliştiricisi olarak profesyonel çalışma; web siteleri ve web uygulamaları geliştirme ve bakımı." },
      { title: "Dijital Pazarlama", context: "Meta · Burs", description: "Eğitim bursuyla Meta bünyesinde altı aylık profesyonel dijital pazarlama eğitimi." },
      {
        title: "Yapay Zekâ",
        context: "Tasarım → Pazarlama",
        description: "Tasarım, geliştirme ve pazarlamada yapay zekâ ile profesyonel çalışma — yapay zekâ destekli web & uygulama tasarımı ve akıllı ev teknolojisi dahil.",
      },
      { title: "Bağımsız çalışma", context: "Serbest", description: "Yapay zekâ, yazılım, web ve dijital projelerde bağımsız çalışma — fikirden çalışan ürüne." },
    ],
    techGroups: { Frontend: "Frontend", Backend: "Backend", Database: "Veritabanı", AI: "Yapay zekâ", Tools: "Araçlar", Design: "Tasarım", Marketing: "Pazarlama" },
    techItems: {
      "Authentication & form handling": "Kimlik doğrulama & form işleme",
      "AI-assisted design & development": "Yapay zekâ destekli tasarım & geliştirme",
      "AI for marketing & content": "Pazarlama & içerik için yapay zekâ",
      "SEO & Local SEO": "SEO & yerel SEO",
      "Content & social media": "İçerik & sosyal medya",
      "Conversion optimisation": "Dönüşüm optimizasyonu",
    },
  },
  projects: {
    powerbowls: {
      category: "Web uygulaması · Online sipariş",
      summary:
        "Duisburg'daki bir bowl & wrap restoranı için sipariş platformu — masada QR kodla, gel-al ya da teslimat için sipariş verin ve siparişi canlı takip edin.",
      overview:
        "Power Bowls, Duisburg'da Mercatorstraße 66 adresindeki taze bowl & wrap restoranıdır. Web uygulaması, herkese açık menüyü eksiksiz bir sipariş akışıyla — masada, gel-al ya da teslimat — ve günlük işletme için bir yönetim paneliyle birleştirir.",
      features: [
        "Üç sipariş türü: masada QR kodla, gel-al ve teslimat",
        "Tahmini hazır olma / teslimat süresiyle canlı sipariş durumu",
        "Bölgeye göre yönetilen teslimat alanları",
        "Müşteri hesapları: kayıt, e-posta doğrulama, tek kullanımlık giriş kodları, şifre sıfırlama",
        "Favoriler, sipariş geçmişi ve sipariş iptali",
        "Yönetim paneli: siparişler, menü & kategoriler, fotoğraf yükleme, masalar, ekip, müşteriler, mesajlar, analizler ve ayarlar",
        "Kendi sunucusunda barındırılan yazı tipleri — üçüncü taraf istek yok (GDPR dostu)",
        "Yüklenebilir web uygulaması manifesti",
      ],
      role: ["Proje yönetimi", "UX & UI tasarımı", "Frontend & backend geliştirme", "Yönetim paneli"],
      challenge:
        "Masada servis, gel-al ve teslimat sunan bir restoranın, misafirlerin telefonda saniyeler içinde anlayacağı tek bir sipariş akışına — ve ekibin öğle yoğunluğunda bile kullanabileceği, üçüncü taraf sipariş platformlarına bağımlı olmayan bir yönetim paneline ihtiyacı vardı.",
      solution:
        "Projeyi aşamalar halinde planladım ve üç sipariş türü için tek bir akış tasarladım: masa QR kodu, gel-al ve teslimat; misafirler yemeklerinin ne zaman hazır olacağını canlı durumla her an bilir. Arkasında menü, fotoğraflar, masalar, teslimat alanları, ekip ve analizler için bir yönetim paneli var. Tek kullanımlık kodlu müşteri hesapları tekrar siparişi hızlandırır, kendi sunucusundaki yazı tipleri uygulamayı GDPR dostu tutar.",
    },
    foodigastro24: {
      category: "B2B web sitesi · Gıda tedariki",
      summary:
        "Restoranlara, otellere, bakım evlerine ve şirketlere meyve, sebze ve seçili gıdalar tedarik eden B2B taze gıda tedarikçisi için web sitesi.",
      overview:
        "Foodigastro24; restoranlar, büfeler, oteller, anaokulları, bakım evleri, ofisler ve şirketlere taze meyve, sebze ve seçili gıdalar tedarik eder. Web sitesi ürün yelpazesini ve hizmetleri tanıtır ve ziyaretçileri teklif taleplerine dönüştürür.",
      features: [
        "GDPR onaylı, PHP ile işlenen teklif talep formu",
        "Taze ürünler, catering & yemekler ve kurumsal müşteriler için hizmet sayfaları",
        "Lightbox'lı görsel galerisi",
        "Kaydırmayla tetiklenen görünme animasyonları (IntersectionObserver)",
        "Çerez onay bandı",
        "Mobil menülü, tamamen duyarlı düzen",
        "SEO meta verileri ve Open Graph paylaşım etiketleri",
      ],
      role: ["Proje yönetimi", "Web tasarımı", "Frontend geliştirme", "Formlar & SEO kurulumu", "Logo & kartvizit"],
      challenge:
        "Bir B2B tedarikçi çok farklı müşterilere hizmet verir — restoranlar, oteller, anaokulları, bakım evleri ve ofisler. Web sitesinin her gruba hitap etmesi, geniş bir ürün yelpazesini net sunması ve ziyaretleri telefon yerine somut teklif taleplerine dönüştürmesi gerekiyordu.",
      solution:
        "Siteyi müşteri gruplarına ve hizmet sayfalarına göre yapılandırdım ve sunucuda işlenen GDPR uyumlu bir teklif formu geliştirdim. Galeri, kaydırma animasyonları ve Open Graph etiketleri ürünleri ekranda ve paylaşımda iyi gösterir; uyumlu bir logo ve kartvizit de markaya tutarlı bir görünüm kazandırır.",
    },
    rundumdienst: {
      category: "Yerel işletme web sitesi · Ev hizmetleri",
      summary:
        "Neuss'taki bir ev ve bina hizmetleri şirketi için müşteri kazanma odaklı web sitesi — tahliye, temizlik, kapıcılık, bahçe bakımı ve onarım.",
      overview:
        "Rundumdienst, Neuss ve çevresinde tahliye, bina temizliği, kapıcılık hizmetleri, bahçe bakımı ve onarım sunar. Web sitesi yerelde bulunmak ve ücretsiz teklif almayı olabildiğince kolaylaştırmak için tasarlandı — form, WhatsApp ya da telefonla.",
      features: [
        "Yerel SEO: hizmet kataloğu, çalışma saatleri, hizmet bölgesi ve coğrafi koordinatlarla Schema.org LocalBusiness işaretlemesi",
        "Sunucu tarafında PHP ile işlenen iletişim formu",
        "WhatsApp ve tıkla-ara iletişim seçenekleri",
        "Gömülü Google Haritası ile hizmet bölgesi bölümü",
        "Hizmetler, projeler ve müşteri yorumları bölümleri",
        "Mobil menülü, tamamen duyarlı düzen",
      ],
      role: ["Proje yönetimi", "Web tasarımı", "Frontend geliştirme", "Yerel SEO", "Logo"],
      challenge:
        "Ev ve bina hizmetleri yerel olarak aranır ve kısa sürede ayarlanır. Şirketin Neuss ve çevre ilçelerde bulunması, iletişime geçmenin de bir telefon kadar kolay olması gerekiyordu.",
      solution:
        "Siteyi yerel arama için kurdum: hizmetler, çalışma saatleri, hizmet bölgesi ve koordinatlarla LocalBusiness yapılandırılmış verisi, ayrıca haritalı bir hizmet bölgesi bölümü. Her sayfa üç iletişim yolu sunar — form, WhatsApp ve tıkla-ara — ve form sunucu tarafında işlenir.",
    },
    "lavin-couture": {
      category: "Online mağaza · Abiye & gelinlik",
      summary:
        "Abiye, gelinlik ve nişanlık için online mağaza — koleksiyonlar, online ödeme, randevu sistemi ve eksiksiz bir yönetim paneli; Almanca, İngilizce ve Türkçe.",
      overview:
        "Lavin Couture abiye, gelinlik ve nişanlık satar. Mağaza, atmosferik bir vitrini butiğin online ihtiyaç duyduğu her şeyle birleştirir: ürün yönetimi, siparişler, ödeme, faturalar ve prova randevuları.",
      features: [
        "Abiye, gelinlik ve nişanlık koleksiyonlarıyla vitrin",
        "Ürün sayfaları, sepet ve ödeme adımı",
        "Stripe ile online ödeme — ödeme kapalıyken WhatsApp üzerinden sipariş",
        "Kişisel prova için randevu ve müşteri hesabı alanı",
        "Yönetim paneli: gösterge paneli, ürünler ve siparişler, korumalı giriş",
        "Siparişler için otomatik fatura yazdırma",
        "Üç dil: Almanca (varsayılan), İngilizce ve Türkçe",
        "Sayfa ve kaydırma animasyonlarıyla siyah-altın koyu lüks tasarım",
      ],
      role: ["Proje yönetimi", "Konsept & UX", "UI tasarımı", "Frontend & backend geliştirme", "Ödeme & yönetim paneli"],
      challenge:
        "Abiye ve gelinlik, müşterilerin genellikle yüz yüze yaptığı duygusal ve yüksek değerli bir alışveriştir. Mağazanın bir butik kadar özel hissettirmesi, üç dilde çalışması ve yine de sahibine ürünler, siparişler ve provalar için basit araçlar sunması gerekiyordu.",
      solution:
        "Mağazayı beş aşamada teslim ettim: vitrin, veritabanı ve yönetim paneli, Stripe ödemesi, otomatik fatura yazdırma ve son olarak diller, müşteri hesapları ve randevu sistemi. Sakin animasyonlu siyah-altın koyu tasarım lüks hissini taşır; WhatsApp sipariş modu ise mağazayı online ödeme olmadan da kullanılabilir tutar.",
    },
    "garten-glanz": {
      category: "Web sitesi · Bahçe bakımı & temizlik",
      summary:
        "Köln'deki bir hizmet şirketi için iki portallı marka web sitesi — bahçe bakımı ve bina temizliği — canlı fiyat hesaplayıcı ve proje galerileriyle.",
      overview:
        "Garten Glanz, bahçe bakımı ve bina temizliğini tek elden sunar. Web sitesi her hizmete uygun içerik ve araçlarla kendi portalını verirken, tek bir marka ikisini birbirine bağlar.",
      features: [
        "İki tam portala açılan ikiye bölünmüş ana sayfa: Garten ve Glanz",
        "Bahçe bakımı için etkileşimli mevsim takvimi",
        "Öncesi / sonrası kaydırıcısı",
        "Temizlik hizmetleri için canlı fiyat hesaplayıcı",
        "Kendini güncelleyen proje galerileri — yeni fotoğraflar kod değişikliği olmadan görünür",
        "Talep formları, WhatsApp ve tıkla-ara",
        "Site haritası, robots.txt, Open Graph ve yapılandırılmış veri",
        "Logo ve marka kimliği",
      ],
      role: ["Proje yönetimi", "Marka & logo", "UX & UI tasarımı", "Frontend geliştirme", "SEO"],
      challenge:
        "Tek şirket, birbirinden çok farklı iki hizmet: bahçe bakımı ve bina temizliği. İkisini tek sayfada karıştırmak ziyaretçinin kafasını karıştırır; iki ayrı web sitesine bölmek ise markayı zayıflatırdı.",
      solution:
        "Ziyaretçilerin ilk bakışta hizmetlerini seçtiği ve tek bir marka altında iki tam portala yönlendirildiği ikiye bölünmüş bir ana sayfa tasarladım. Her portalın kendi araçları var — bahçe için mevsim takvimi, temizlik için canlı fiyat hesaplayıcı — ve yeni fotoğraf eklendiğinde kendini güncelleyen galeriler sayesinde yeni referanslar için hiçbir zaman geliştiriciye gerek kalmaz.",
    },
    martins: {
      category: "Marka & web tasarımı · Ev hizmetleri",
      summary: "Neuss'taki bir kapıcılık ve bahçe hizmeti için eksiksiz marka — logo, kartvizit, broşür ve web sitesi tasarımı.",
      overview:
        "Martin's Hausmeister & Garten Service, basılı materyalde ve internette tanınır bir görünüme ihtiyaç duyuyordu. Kimlik, kartvizitten web sitesine kadar aynı yeşili, aynı işareti ve aynı fotoğraf stilini taşır.",
      features: ["Ev, ağaç ve kalbi birleştiren logo", "Dikey formatta kartvizit", "DIN uzun broşür, ön ve arka yüz", "Masaüstü ve mobil için web sitesi tasarımı"],
      role: ["Proje yönetimi", "Marka kimliği & logo", "Baskı tasarımı", "Web tasarımı"],
      challenge:
        "Yeni bir kapıcılık ve bahçe hizmetinin, üzerine inşa edilecek mevcut bir marka olmadan, ilk günden itibaren köklü görünmesi gerekiyordu — kartvizitlerde, broşürlerde ve internette.",
      solution:
        "Ev, ağaç ve kalbi birleştiren bir logo tasarladım ve her temas noktasını aynı yeşil, aynı işaret ve aynı fotoğraf stili üzerine kurdum. Kartvizit, DIN uzun broşür ve web sitesi tasarımı birlikte teslim edildi; böylece marka, müşterilerin onunla karşılaştığı her yerde aynı görünür.",
    },
    pantochi: {
      category: "Mobil uygulama · Parti oyunu",
      summary: "Gruplar için pandomim parti oyunu — takımlar, kategoriler, zorluk seviyeleri, zamanlayıcı ve puanlama; platformlar arası mobil uygulama olarak.",
      overview:
        "PantoChi, klasik pandomim oyununu yönlendirmeli bir uygulamaya dönüştürür: takımları kurar, kelimeleri seçer, zamanlayıcıyı yönetir ve puanı tutar; böylece grup canlandırmaya ve tahmin etmeye odaklanabilir.",
      features: [
        "2 ila 6 takım, ayarlanabilir tur sayısı",
        "Otomatik 90 saniyelik zamanlayıcı ya da 30–300 saniye arası manuel süre",
        "Üç zorluk seviyesinde 1.445 kelimeli 15 kategori",
        "Hızlı tahminler için zaman bonuslu puanlama",
        "Takım ve oyun başına bir kelime değiştirme hakkı",
        "Kendi tipografi ölçeğine sahip sağdan sola Farsça arayüz",
        "Özel logo, ikonlar ve konfeti animasyonları",
      ],
      role: ["Ürün konsepti", "Proje yönetimi", "UX & UI tasarımı", "Uygulama geliştirme"],
      challenge:
        "Pandomim genellikle kâğıt parçaları, kronometre ve puan tutan biriyle oynanır — ve birileri hep takibi kaçırır. Uygulamanın gürültülü bir grup oyununu bölmeden tüm bunları üstlenmesi ve sağdan sola bir dilde doğal okunması gerekiyordu.",
      solution:
        "Yönlendirmeli bir oyun akışı tasarladım: takımlar ve turlar, kategori ve zorluk, zamanlayıcı ve zaman bonuslu otomatik puanlama. Üç seviyede 15 kategoride 1.445 kelime her oyunu taze tutar; büyük butonlar ve net renkler kalabalık bir odada işe yarar, özel bir Farsça yazı ölçeği de sağdan sola arayüzü kolay okunur kılar.",
    },
    fixio: {
      category: "Mobil uygulama · Araç tamiri için yapay zekâ",
      summary:
        "Sürücüler ve servisler için, araç parçalarını fotoğraftan yapay zekâyla tanıyan, doğru yedek parçayı bulan ve montajda adım adım yol gösteren uygulama.",
      overview:
        "FixIO basit bir sorudan doğdu: Bir araç parçasının fotoğrafını çekip ne olduğunu, hangi yedek parçanın uyduğunu ve nasıl takılacağını hemen öğrenebilseydiniz? Proje bir mobil uygulamayı, bir API'yi ve araç parçaları üzerine eğitilmiş bir bilgisayarlı görü modelini birleştirir.",
      features: [
        "Özel eğitilmiş bir YOLOv8 modeliyle fotoğraftan araç parçası tanıma",
        "Plaka, QR kod ya da fotoğraf yükleyerek arama",
        "Marka ve modele göre araç profilleri",
        "Adım adım montaj kılavuzlu yedek parça sayfaları",
        "Tanınan parça hakkındaki soruları yanıtlayan yapay zekâ asistanı",
        "Kimlik doğrulama, görsel yükleme ve PostgreSQL veritabanlı backend",
        "Figma'da eksiksiz UI tasarımı",
      ],
      role: ["Ürün konsepti", "Proje yönetimi", "UX & UI tasarımı (Figma)", "Uygulama & API geliştirme", "Yapay zekâ modeli eğitimi"],
      challenge:
        "Sürücüler ve küçük servisler çoğu zaman hangi parçaya baktıklarını, hangi yedek parçanın araçlarına uyduğunu ya da nasıl takılacağını tam olarak bilemez. Bunu yanıtlamak; görüntü tanıma, bir parça veritabanı ve net bir rehberlik gerektirir — tek bir mobil uygulamada.",
      solution:
        "Parçaları fotoğraftan tanıması için özel bir araç parçası veri setinde YOLOv8 modeli eğittim ve bunu plaka ya da QR kodla aramayla birleştirdim. PostgreSQL'li bir Fastify API araçları, taramaları ve parçaları saklar; adım adım kılavuzlar montajda yol gösterir ve bir yapay zekâ asistanı ek soruları yanıtlar. Tüm arayüz, geliştirmeden önce Figma'da tasarlandı.",
    },
  },
};
