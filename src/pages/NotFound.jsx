import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found__card">
        <h1>404</h1>
        <p>Сторінку не знайдено або вона більше не доступна.</p>
        <Link to="/" className="not-found__link">
          Повернутися до каталогу
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
