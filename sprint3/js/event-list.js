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

    // Kart HTML şablonu
    function createCard(event) {
    return `
        <article class="kart">
        <h3>${event.title}</h3>
        <span class="etiket">${event.category}</span>
        <p class="tarih">Tarih: ${formatDate(event.date)}, ${event.time}</p>
        <p class="yer">Yer: ${event.location}</p>
        <p class="kontenjan">Kontenjan: ${event.capacity} kişi</p>
        <p class="aciklama">${event.description}</p>
        <a href="etkinlik-detay.html?id=${event.id}" class="detay-link">Detayları gör</a>
        </article>
    `;
    }

    const listContainer = document.querySelector("#etkinlik-listesi");

    export function render(dizi) {
    if (!listContainer) return;
    listContainer.innerHTML = dizi.map(createCard).join("");
    }

    // Ana Sayfa veya Liste Sayfası Mantığı
    if (listContainer) {
    if (listContainer.dataset.limit) {
        // Ana sayfa: En yakın 2 etkinlik
        const yaklasan = [...events]
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, Number(listContainer.dataset.limit));
        render(yaklasan);
    } else {
        // Etkinlikler (Liste) sayfası
        render(events);

        const aramaInput = document.querySelector("#arama");
        const kategoriSelect = document.querySelector("#kategori-filtre");
        const sonucSatiri = document.querySelector("#sonuc");
        const filtreFormu = document.querySelector("#filtre-formu");

        // Enter'a basınca sayfa yenilenmesini önle
        if (filtreFormu) {
        filtreFormu.addEventListener("submit", (e) => e.preventDefault());
        }

        // Kategorileri veriden tekil olarak çekip select içine ekle
        if (kategoriSelect) {
        const kategoriler = [...new Set(events.map((e) => e.category))];
        kategoriler.forEach((kat) => {
            const opt = document.createElement("option");
            opt.value = kat;
            opt.textContent = kat;
            kategoriSelect.appendChild(opt);
        });
        }

        // Filtreleme fonksiyonu
        function filtrele() {
        const aranan = aramaInput ? aramaInput.value.trim().toLocaleLowerCase("tr-TR") : "";
        const secilenKategori = kategoriSelect ? kategoriSelect.value : "";

        const sonuc = events.filter((e) => {
            const titleMatch = e.title.toLocaleLowerCase("tr-TR").includes(aranan);
            const descMatch = e.description.toLocaleLowerCase("tr-TR").includes(aranan);
            const metinUyuyor = aranan === "" || titleMatch || descMatch;
            const kategoriUyuyor = secilenKategori === "" || e.category === secilenKategori;
            return metinUyuyor && kategoriUyuyor;
        });

        render(sonuc);

        if (sonucSatiri) {
            if (sonuc.length === 0) {
            sonucSatiri.textContent = "Aramanıza uygun etkinlik bulunamadı.";
            } else {
            sonucSatiri.textContent = `${sonuc.length} etkinlik listeleniyor.`;
            }
        }
        }

        if (aramaInput) aramaInput.addEventListener("input", filtrele);
        if (kategoriSelect) kategoriSelect.addEventListener("change", filtrele);
    }
    }