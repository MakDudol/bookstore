import { useRef, useState } from "react";
import heroLogo from "../assets/logo.png";
import smallHeroFallback from "../assets/Solovyina_logo_icon_bird_white.png";
import InfoModal from "./InfoModal";
import "./Masthead.css";

const HERO_ALT = "Солов'їна — логотип";
const HERO_EYEBROW = "Українські книжки поруч із вами";
const INFO_ITEMS = [
  {
    key: "custom-order",
    label: "Книги під замовлення",
    title: "Книги під замовлення",
    body: `Якщо потрібної книги немає в нашому асортименті,
ви можете замовити її індивідуально.

Зв’яжіться з нами через Instagram або Facebook,
і ми повідомимо про можливість замовлення та терміни доставки.

Для книг, що замовляються з України, передбачена передоплата 50%.`,
  },
  {
    key: "delivery-payment",
    label: "Доставка і оплата",
    title: "Доставка і оплата",
    body: "Інформацію буде додано незабаром.",
  },
  {
    key: "promotions",
    label: "Акції",
    title: "Акції",
    body: `🟢 Постійно діючі
🚚 Безкоштовна доставка по Канаді
При замовленні на суму від 150$ доставка по Канаді — безкоштовна.

🚇 Безкоштовна доставка в Монреалі до метро
Ми безкоштовно підвозимо ваше замовлення до однієї з станцій метро:
Berry–UQAM, Viau, Saint-Michel, Beaubien.

Також можемо домовитися про інше зручне місце в межах Монреаля.

🔴 Спеціальні пропозиції
💖 День святого Валентина в «Солов’їній»
До 14 лютого включно — –10% на всі любовні романи.
Чудова нагода зробити книжковий подарунок коханій людині.
📦 Доставка по Канаді та США`,
  },
];

function Masthead() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null);
  const triggerRef = useRef(null);

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
                className="hero__badge"
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
    </section>
  );
}

export default Masthead;
