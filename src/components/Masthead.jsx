import { useEffect, useRef, useState } from "react";
import heroLogo from "../assets/logo.png";
import smallHeroFallback from "../assets/Solovyina_logo_icon_bird_white.png";
import easterPromoImage from "../assets/velykden.jpg";
import InfoModal from "./InfoModal";
import "./Masthead.css";

const HERO_ALT = "Солов'їна — логотип";
const HERO_EYEBROW = "Українські книжки поруч із вами";
const EASTER_PROMO_SESSION_KEY = "easter-promo-shown";
const INFO_ITEMS = [
  {
    key: "custom-order",
    label: "Книги під замовлення",
    title: "Книги під замовлення",
    body: `Якщо потрібної книги немає в нашому асортименті, ви можете замовити її індивідуально.
Зв’яжіться з нами через Instagram або Facebook, і ми повідомимо про можливість замовлення та терміни доставки.
Для книг, що замовляються з України, передбачена передоплата 50%.`,
  },
  {
    key: "delivery-payment",
    label: "Доставка і оплата",
    title: "Доставка і оплата",
    body: `✓ По Канаді та США відправляємо замовлення через CanadaPost.
✓ При замовленні від 200 доларів відправка по Канаді безкоштовна.
✓ В Монреалі можливий самовивіз з нашого шоу-руму. Також безкоштовно доставляємо до станцій метро Berri-UQAM, Viau, BeauBien, Saint Michelle.
✓ Оплата при отриманні готівкою або є-трансфером`,
  },
  {
    key: "promotions",
    label: "Акції",
    title: "Акції",
    body: `🟢 Постійно діючі
🚚 При замовленні на суму від 150$ доставка по Канаді — безкоштовна.

🚇 Ми безкоштовно підвозимо ваше замовлення до однієї з станцій метро:
Berry–UQAM, Viau, Saint-Michel, Beaubien.

Також можемо домовитися про інше зручне місце в межах Монреаля.

🔴 Спеціальні пропозиції
Великодня акція
До 19 квітня при замовленні від трьох книг знижка 10%`,
  },
];

function Masthead() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null);
  const [isEasterPromoOpen, setIsEasterPromoOpen] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    try {
      const hasSeenPromo = sessionStorage.getItem(EASTER_PROMO_SESSION_KEY);
      if (!hasSeenPromo) {
        setIsEasterPromoOpen(true);
        sessionStorage.setItem(EASTER_PROMO_SESSION_KEY, "1");
      }
    } catch {
      setIsEasterPromoOpen(true);
    }
  }, []);

  const handleOpen = (info, event) => {
    triggerRef.current = event.currentTarget;
    setActiveInfo(info);
    setIsInfoOpen(true);
  };

  const handleClose = () => {
    setIsInfoOpen(false);
    setActiveInfo(null);
    if (triggerRef.current) {
      const target = triggerRef.current;
      requestAnimationFrame(() => target.focus());
    }
  };

  const handleEasterPromoClose = () => {
    setIsEasterPromoOpen(false);
  };

  return (
    <section className="site-hero" role="banner">
      <div className="masthead-frame">
        <div className="site-hero__inner">
          <div className="site-hero__logo">
            <img
              src={heroLogo}
              alt={HERO_ALT}
              loading="eager"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = smallHeroFallback;
              }}
            />
          </div>
          {HERO_EYEBROW && <p className="site-hero__eyebrow">{HERO_EYEBROW}</p>}
          <div className="hero__badges">
            {INFO_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`hero__badge${item.key === "promotions" ? " hero__badge--promotions" : ""}`}
                onClick={(event) => handleOpen(item, event)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {isInfoOpen && activeInfo && (
        <InfoModal title={activeInfo.title} body={activeInfo.body} onClose={handleClose} />
      )}
      {isEasterPromoOpen && (
        <InfoModal
          title=""
          body={
            <div className="easter-promo">
              <img className="easter-promo__image" src={easterPromoImage} alt="Великодня акція" />
            </div>
          }
          onClose={handleEasterPromoClose}
        />
      )}
    </section>
  );
}

export default Masthead;
