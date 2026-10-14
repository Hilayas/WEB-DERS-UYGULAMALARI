import { useState, useEffect } from "react";
import "./App.css";
import { events } from "./data/events";
import type { CampusEvent, Category } from "./types/campus-event";
import { searchEvents, filterByCategory, findEventById } from "./utils/filter-events";

type PageName = "home" | "events" | "detail" | "add" | "update";

function App() {
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  const go = (next: PageName, id: string | null = null) => {
    setPage(next);
    setSelectedId(id);
  };

  const selected = selectedId ? findEventById(events, selectedId) : undefined;

  useEffect(() => {
    if (page === "detail" && selected) {
      document.title = `Kampüs Etkinlikleri | ${selected.title}`;
    } else if (page === "events") {
      document.title = "Kampüs Etkinlikleri | Tüm Etkinlikler";
    } else if (page === "add") {
      document.title = "Kampüs Etkinlikleri | Etkinlik Ekle";
    } else if (page === "update") {
      document.title = "Kampüs Etkinlikleri | Etkinlik Güncelle";
    } else {
      document.title = "Kampüs Etkinlikleri | Ana Sayfa";
    }
  }, [page, selected]);

  const upcoming = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  const filtered = filterByCategory(
    searchEvents(events, searchText),
    category
  );

  const categories: Category[] = ["Seminer", "Atölye", "Söyleşi", "Yarışma"];

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    const monthIndex = parseInt(parts[1], 10) - 1;
    return `${parseInt(parts[2], 10)} ${months[monthIndex]} ${parts[0]}`;
  };

  function renderCard(event: CampusEvent) {
    return (
      <article className="kart" key={event.id}>
        <h2>{event.title}</h2>
        <span className="rozet">{event.category}</span>
        <p className="tarih">
          Tarih: {formatDate(event.date)}, {event.time}
        </p>
        <p className="konum">Yer: {event.location}</p>
        <p className="kontenjan">Kontenjan: {event.capacity} kişi</p>
        <p className="ozet">{event.description}</p>
        <button
          type="button"
          className="buton-detay"
          onClick={() => go("detail", event.id)}
        >
          Detayları gör
        </button>
      </article>
    );
  }

  return (
    <>
      <header className="site-baslik">
        <h1>Kampüs Etkinlikleri</h1>
        <p>
          Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin.
        </p>
        <nav className="menu">
          <a
            href="#home"
            aria-current={page === "home" ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              go("home");
            }}
          >
            Ana Sayfa
          </a>
          <a
            href="#events"
            aria-current={page === "events" ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              go("events");
            }}
          >
            Etkinlikler
          </a>
          <a
            href="#add"
            aria-current={page === "add" ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              go("add");
            }}
          >
            Ekle
          </a>
        </nav>
      </header>

      <main>
        {/* 1. ANA SAYFA */}
        {page === "home" && (
          <section className="ana-sayfa">
            <h2>Yaklaşan 2 Etkinlik</h2>
            <div className="etkinlik-listesi">
              {upcoming.map(renderCard)}
            </div>
            <div className="tum-link-kutu">
              <button
                type="button"
                className="buton-primary"
                onClick={() => go("events")}
              >
                Tüm etkinlikleri gör
              </button>
            </div>
          </section>
        )}

        {/* 2. ETKİNLİKLER SAYFASI */}
        {page === "events" && (
          <section className="etkinlikler-sayfasi">
            <h2>Tüm Etkinlikler</h2>
            <p className="sayfa-aciklama">
              Ekim ayında kampüste düzenlenen etkinlikler.
            </p>

            <div className="arama-filtre-kutusu">
              <div className="filtre-grup">
                <label htmlFor="search">Etkinlik ara</label>
                <input
                  id="search"
                  type="search"
                  placeholder="Örn. atölye, kariyer"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <div className="filtre-grup">
                <label htmlFor="category">Kategori</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Category | "")
                  }
                >
                  <option value="">Tümü</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="sonuc-sayisi">
              {filtered.length === 0
                ? "Etkinlik bulunamadı."
                : `${filtered.length} etkinlik listeleniyor.`}
            </p>

            <div className="etkinlik-listesi">
              {filtered.map(renderCard)}
            </div>
          </section>
        )}

        {/* 3. DETAY SAYFASI */}
        {page === "detail" && (
          <>
            {!selected ? (
              <section className="detay-hata">
                <h2>Etkinlik bulunamadı</h2>
                <button
                  type="button"
                  className="buton-secondary"
                  onClick={() => go("events")}
                >
                  Listeye dön
                </button>
              </section>
            ) : (
              <section className="detay-sayfasi">
                <h2>{selected.title}</h2>
                <div className="detay-icerik">
                  {selected.image && (
                    <figure className="afis-kutu">
                      <img src={selected.image} alt={`${selected.title} afişi`} />
                    </figure>
                  )}
                  <aside className="kunye-kutu">
                    <h3>Etkinlik Künyesi</h3>
                    <dl>
                      <dt>Tarih</dt>
                      <dd>
                        {formatDate(selected.date)}, {selected.time}
                      </dd>
                      <dt>Yer</dt>
                      <dd>{selected.location}</dd>
                      <dt>Kategori</dt>
                      <dd>{selected.category}</dd>
                      <dt>Kontenjan</dt>
                      <dd>{selected.capacity} kişi</dd>
                    </dl>
                  </aside>
                </div>

                <div className="aciklama-kutu">
                  <h3>Açıklama</h3>
                  <p>{selected.description}</p>
                </div>

                <div className="detay-butonlar">
                  <button
                    type="button"
                    className="buton-secondary"
                    onClick={() => go("events")}
                  >
                    Listeye dön
                  </button>
                  <button
                    type="button"
                    className="buton-primary"
                    onClick={() => go("update", selected.id)}
                  >
                    Bu etkinliği güncelle
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        {/* 4. EKLE VE 5. GÜNCELLE SAYFALARI */}
        {(page === "add" || page === "update") && (
          <section className="form-sayfasi">
            <h2>
              {page === "add" ? "Etkinlik Ekle" : "Etkinlik Güncelle"}
            </h2>
            <p className="form-bilgi">
              Bu sprintte form sadece görünüm; kayıt yapılmaz.
            </p>

            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-grup">
                <label htmlFor="title">Etkinlik Adı</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Örn. Kariyer Günleri 2026"
                  maxLength={80}
                />
              </div>

              <div className="form-grup">
                <label htmlFor="form-category">Kategori</label>
                <select id="form-category" defaultValue="">
                  <option value="" disabled>
                    Seçiniz
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grup">
                <label htmlFor="date">Tarih</label>
                <input id="date" type="date" />
              </div>

              <div className="form-grup">
                <label htmlFor="time">Saat</label>
                <input id="time" type="time" />
              </div>

              <div className="form-grup">
                <label htmlFor="location">Yer</label>
                <input
                  id="location"
                  type="text"
                  placeholder="Örn. A Blok Konferans Salonu"
                />
              </div>

              <div className="form-grup">
                <label htmlFor="capacity">Kontenjan</label>
                <input id="capacity" type="number" min={1} />
              </div>

              <div className="form-grup">
                <label htmlFor="description">Açıklama</label>
                <textarea id="description" rows={5} />
              </div>

              <button type="submit" className="buton-primary">
                Kaydet
              </button>
            </form>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <p>Hilal Aslan - C2211011066 - 2026</p>
      </footer>
    </>
  );
}

export default App;