    import { events } from "./data.js";

    // Tarihi Türkçe formatına çevir
    function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    }

    const detayContainer = document.querySelector("#detay");
    const sayfaBaslik = document.querySelector("#sayfa-baslik");

    // URL'den id parametresini al
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // İlgili etkinliği bul
    const event = events.find((e) => e.id === id);

    if (!event) {
    // Etkinlik bulunamadıysa veya id parametresi eksikse
    document.title = "Etkinlik bulunamadı";
    if (sayfaBaslik) sayfaBaslik.textContent = "Etkinlik bulunamadı";

    detayContainer.innerHTML = `
        <div class="hata-kutusu" style="border: 1px solid #d9534f; background-color: #fdf7f7; color: #a94442; padding: 1.2rem; border-radius: 6px; margin: 1.5rem 0;">
        <p style="margin: 0; font-weight: 500;">
            ${id ? `"${id}" numaralı bir etkinlik yok.` : "Herhangi bir etkinlik seçilmedi."} Listeden bir etkinlik seçin.
        </p>
        </div>
        <a href="etkinlikler.html" class="buton" style="display: inline-block; padding: 0.6rem 1.2rem; background: var(--renk-ana, #1b7340); color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">
        ← Listeye dön
        </a>
    `;
    } else {
    // Etkinlik bulundu: Başlıkları ve içeriği doldur
    document.title = event.title;
    if (sayfaBaslik) sayfaBaslik.textContent = event.title;

    detayContainer.innerHTML = `
        <div class="detay-izgara" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 1.5rem;">
        <section class="detay-sol">
            <div class="afis" style="border: 4px solid #f39c12; background: #1a2530; color: white; padding: 3rem 1.5rem; text-align: center; border-radius: 4px;">
            <h2 style="color: white; margin-bottom: 0.5rem; font-size: 1.6rem;">${event.title}</h2>
            <p style="color: #e67e22; font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">2026</p>
            <p style="color: #ecf0f1; font-size: 0.95rem;">${formatDate(event.date)} · ${event.location}</p>
            </div>
            <p style="font-style: italic; font-size: 0.85rem; color: #666; margin-top: 0.5rem;">${event.title} afişi</p>
        </section>

        <section class="detay-sag">
            <div class="kunye-kutusu" style="border: 1px solid #e1e4e8; border-radius: 8px; padding: 1.5rem; background: #fff;">
            <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.25rem;">Etkinlik Künyesi</h3>
            <dl style="display: grid; grid-template-columns: 100px 1fr; gap: 0.8rem 0; margin: 0;">
                <dt style="font-weight: bold;">Tarih</dt>
                <dd style="margin: 0;">${formatDate(event.date)}, ${event.time}</dd>

                <dt style="font-weight: bold;">Yer</dt>
                <dd style="margin: 0;">${event.location}</dd>

                <dt style="font-weight: bold;">Kategori</dt>
                <dd style="margin: 0;">${event.category}</dd>

                <dt style="font-weight: bold;">Kontenjan</dt>
                <dd style="margin: 0;">${event.capacity} kişi</dd>
            </dl>
            </div>
        </section>
        </div>

        <section class="detay-aciklama" style="margin-top: 2rem;">
        <h3>Açıklama</h3>
        <p style="line-height: 1.6;">${event.description}</p>
        
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
            <a href="etkinlikler.html" style="padding: 0.6rem 1.2rem; background: var(--renk-ana, #1b7340); color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">
            ← Listeye dön
            </a>
            <a href="etkinlik-guncelle.html?id=${event.id}" style="padding: 0.6rem 1.2rem; background: var(--renk-ana, #1b7340); color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">
            Bu etkinliği güncelle
            </a>
        </div>
        </section>
    `;
    }
    