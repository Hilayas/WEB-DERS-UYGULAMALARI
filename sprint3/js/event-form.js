    import { events } from "./data.js";

    const form = document.querySelector("#etkinlik-formu");
    const mesajAlani = document.querySelector("#form-mesaj");

    if (form) {
    const isGuncelle = form.dataset.mode === "guncelle";
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const aktifEtkinlik = events.find((e) => e.id === id);

    // Güncelleme modu kontrolü:
    if (isGuncelle) {
        if (!id || !aktifEtkinlik) {
        // id yoksa veya etkinlik bulunamazsa formu kaldır, uyarı göster
        const formAlani = document.querySelector("#form-alani");
        if (formAlani) {
            formAlani.innerHTML = `
            <div class="hata-kutusu" style="border: 1px solid #d9534f; background-color: #fdf7f7; color: #a94442; padding: 1.2rem; border-radius: 6px; margin: 1.5rem 0;">
                <p style="margin: 0; font-weight: 500;">
                Güncellenecek etkinlik seçilmedi. Önce listeden bir etkinlik seçin, detay sayfasındaki "Bu etkinliği güncelle" butonunu kullanın.
                </p>
            </div>
            <a href="etkinlikler.html" style="display: inline-block; padding: 0.6rem 1.2rem; background: var(--renk-ana, #1b7340); color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">
                Etkinliklere git
            </a>
            `;
        }
        } else {
        // Etkinlik bulundu: Form alanlarını doldur
        form.elements.ad.value = aktifEtkinlik.title || "";
        form.elements.kategori.value = aktifEtkinlik.category || "";
        form.elements.tarih.value = aktifEtkinlik.date || "";
        form.elements.saat.value = aktifEtkinlik.time || "";
        form.elements.yer.value = aktifEtkinlik.location || "";
        form.elements.kontenjan.value = aktifEtkinlik.capacity ?? "";
        form.elements.aciklama.value = aktifEtkinlik.description || "";
        }
    }

    // Submit Olayı
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fd = new FormData(form);

        const data = {
        id: isGuncelle && aktifEtkinlik ? aktifEtkinlik.id : `event-${events.length + 1}`,
        title: (fd.get("ad") || "").trim(),
        category: fd.get("kategori") || "",
        date: fd.get("tarih") || "",
        time: fd.get("saat") || "",
        location: (fd.get("yer") || "").trim(),
        capacity: fd.get("kontenjan") ? Number(fd.get("kontenjan")) : null,
        description: (fd.get("aciklama") || "").trim()
        };

        // Hata temizliği
        const alanlar = ["ad", "kategori", "tarih", "saat", "yer", "kontenjan"];
        alanlar.forEach((alan) => {
        const el = form.elements[alan];
        const hataSpan = document.querySelector(`#hata-${alan}`);
        if (el) el.removeAttribute("aria-invalid");
        if (hataSpan) hataSpan.textContent = "";
        });
        if (mesajAlani) mesajAlani.innerHTML = "";

        // Doğrulama kuralları
        const errors = {};

        if (data.title.length < 3) {
        errors.ad = "Etkinlik adı en az 3 karakter olmalı.";
        }

        if (!data.category) {
        errors.kategori = "Bir kategori seçin.";
        }

        if (!data.date) {
        errors.tarih = "Tarih seçin.";
        }

        if (!data.time) {
        errors.saat = "Saat seçin.";
        }

        if (!data.location) {
        errors.yer = "Yer bilgisini yazın.";
        }

        if (data.capacity !== null && (data.capacity < 1 || data.capacity > 1000 || isNaN(data.capacity))) {
        errors.kontenjan = "Kontenjan 1 ile 1000 arasında bir sayı olmalıdır.";
        }

        // Hata varsa
        if (Object.keys(errors).length > 0) {
        for (const [key, msg] of Object.entries(errors)) {
            const el = form.elements[key];
            const hataSpan = document.querySelector(`#hata-${key}`);
            if (el) el.setAttribute("aria-invalid", "true");
            if (hataSpan) hataSpan.textContent = msg;
        }
        return;
        }

        // Başarılı gönderim
        mesajAlani.innerHTML = `
        <div class="basari-kutusu">
            <p style="margin: 0; font-weight: bold;">
            ${isGuncelle ? "Etkinlik güncellendi (bu sprintte kaydedilmez):" : "Etkinlik oluşturuldu (bu sprintte kaydedilmez):"}
            </p>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
        `;
    });
    }