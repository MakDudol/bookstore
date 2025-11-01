const books = [
  {
    id: 'King-horror-book',
    title: 'Зелена миля',
    author: 'Стівен Кінг',
    priceCad: 40,
    coverUrl:
      'https://bookchef.ua/upload/resize_cache/iblock/2ec/390_390_1/2ecf7a0e502b3076c52caa5539fcbb5f.jpg',
    genre: ['Жахи', 'Класика'],
    category: 'Зарубіжна література',
    tags: ['жахи', 'класика'],
    description:
      'Історія у тюрмі смертників: дивний в’язень, співчуття охоронців, боротьба добра проти жорстокості й страху.',
  },
  {
    id: 'zhnec-book',
    title: 'Жнець',
    author: 'Ніл Шустерман',
    priceCad: 40,
    coverUrl:
      'https://static.yakaboo.ua/media/cloudflare/product/webp/600x840/7/7/777_5_1.jpg',
    genre: ['Фантастика', 'Соціальний роман'],
    category: 'Зарубіжна література',
    tags: ['моральний вибір', 'майбутнє'],
    description:
      'Майбутнє без смерті, жнеці контролюють життя, двоє підлітків навчаються вбивати, обираючи моральний шлях свій.',
  },
  {
    id: 'Rebecca-Yarros-iron-flame',
    title: 'Залізне полум’я',
    author: 'Ребекка Яррос',
    priceCad: 40,
    coverUrl:
      'https://fabulabook.com/storage/img/product/0f318d794e0bf39c.png',
    genre: ['Фентезі', 'Любовний роман'],
    category: 'Зарубіжна література',
    tags: ['дракони', 'випробовування'],
    description:
      'У світі, де влада вимагає жорстокості, вона навчається виживати й обирати власний шлях серця.',
  },
  {
    id: 'Rebecca-Yarros-onyx-storm',
    title: 'Оніксова буря',
    author: 'Ребекка Яррос',
    priceCad: 40,
    coverUrl:
      'https://bajkibabajki.com/image/cache/6780fbc6546bf2ba6404abb85d04a88b-1200x1200.webp',
    genre: ['Фентезі', 'Любовний роман'],
    category: 'Зарубіжна література',
    tags: ['боротьба', 'довіра'],
    description:
      'Коли тінь над світом зростає, вони мають об’єднати сили й серця, щоб не втратити майбутнє.',
  },
  {
    id: 'Freida-McFadden-housmaid',
    title: 'Секрет Служниці',
    author: 'Фріда Мак-Фадден',
    priceCad: 40,
    coverUrl:
      'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQro3NZzMPSOAxECRa5SM-0L3aEuCMRlqAyAHDYfrIVi8Bk-R4nVvzynDpo6JDtx9T3tqBz96NBV0XR1KhHBkfA-39TRz6EPЗx_9fldcgmTQAMbyw3do0L58g',
    genre: ['Трилери', 'Детективи'],
    category: 'Зарубіжна література',
    tags: ['таємниці', 'напруження'],
    description:
      'Молода жінка влаштовується прислугою, але ідеальний дім швидко виявляється пасткою з небезпечними загадками.',
  },
  {
    id: 'Rebecca-Yarros-fourth-wing',
    title: 'Четверте крило',
    author: 'Ребекка Яррос',
    priceCad: 40,
    coverUrl:
      'https://i.ebayimg.com/images/g/l~oAAOSw7qpll6w8/s-l400.jpg',
    genre: ['Фентезі', 'Пригодницький роман'],
    category: 'Зарубіжна література',
    tags: ['небезпека', 'вибір'],
    description:
      'Нестійка на фізичну силу дівчина вступає до смертельно ризикованої академії й мусить довести, що хоробрість визначає більше, ніж міць.',
  },
  {
    id: 'Igor-Davydenko-merva',
    title: 'Мерва',
    author: 'Ігор Давиденко',
    priceCad: 40,
    coverUrl:
      'https://images.prom.ua/5584918187_w200_h200_merva-kniga-1.jpg',
    genre: ['Соціальний роман', 'Психологія'],
    category: 'Українська література',
    tags: ['ізоляція', 'таємниця'],
    description:
      'У віддаленому селищі минуле переплітається з тривожними чутками, змушуючи людей бачити небезпеку навіть у власних думках.',
  },
  {
    id: 'HDCarlton-peresliduvannya-adeliny',
    title: 'Переслідування Аделіни',
    author: 'Х.Д. Карлтон',
    priceCad: 40,
    coverUrl: 'https://static.bookssecondlife.com.ua/wa-data/public/shop/products/02/webp/80/72/17280/images/50168/50168.2500.webp',
    genre: ['Любовний роман', 'Трилери'],
    category: 'Зарубіжна література',
    tags: ['романтика', 'трилер'],
    description:
      'Небезпечна пристрасть стикається з межами свободи, коли гра перетворюється на випробування довіри.',
  },
  {
    id: 'HDCarlton-polyuvannya-na-adelinu',
    title: 'Полювання на Аделіну',
    author: 'Х.Д. Карлтон',
    priceCad: 40,
    coverUrl: 'https://book-ye.com.ua/media/catalog/product/cache/79524a38d3bc3d0f3b6015a08841400c/4/2/42a71e9f-c4ea-11ee-8192-00505684ea69_595ab3ad-aa7e-11f0-81c4-005056b0789c.jpg',
    genre: ['Любовний роман', 'Трилери'],
    category: 'Зарубіжна література',
    tags: ['романтика', 'трилер'],
    description:
      'Минуле не відпускає: полювання триває, і рішення серця стають питанням безпеки.',
  },
  {
    id: 'Dorzh-Batu-tayemnycya-starogo-lamy',
    title: 'Таємниця старого Лами',
    author: 'Дорж Бату',
    priceCad: 40,
    coverUrl: 'https://oksamutbooks.com.ua/wp-content/uploads/2022/11/taiemnytsia_staroho_lamy_cover_3d_png-150x216.webp',
    genre: ['Пізнавальна література', 'Психологія'],
    category: 'Українська література',
    tags: ['духовність', 'історія'],
    description:
      'Подорож усередину віри та пам’яті відкриває крихкі істини про свободу й співчуття.',
  },
  {
    id: 'Andriy-Kokotyukha-tochka-vyhodu',
    title: 'Точка виходу',
    author: 'Андрій Кокотюха',
    priceCad: 40,
    coverUrl: 'https://book-ye.com.ua/media/catalog/product/cache/79524a38d3bc3d0f3b6015a08841400c/0/2/02bfe529-f295-11ef-81b9-005056857596_7c22bf17-f296-11ef-81b9-005056857596.jpg',
    genre: ['Трилери', 'Детективи'],
    category: 'Українська література',
    tags: ['війна', 'пригоди'],
    description:
      'Посеред війни команда шукає шлях назовні, балансуючи між обов’язком, ризиком і надією.',
  },
  {
    id: 'Julia-Quinn-bridzhertony',
    title: 'Бріджертони',
    author: 'Джулія Куїнн',
    priceCad: 40,
    coverUrl: 'https://book-ye.com.ua/media/catalog/product/cache/79524a38d3bc3d0f3b6015a08841400c/d/9/d91f4230-56e8-11ee-8188-00505684ea69_64ec5dd8-74d8-11ee-818c-00505684ea69.jpg',
    genre: ['Любовний роман', 'Історичний роман'],
    category: 'Зарубіжна література',
    tags: ['романтика', 'світські інтриги'],
    description:
      'У світі бальних сезонів і чуток справжні почуття порушують правила гри суспільства.',
  },
  {
    id: 'Andriy-Kokotyukha-dovga-komendantska-hodyna',
    title: 'Довга комендантська година',
    author: 'Андрій Кокотюха',
    priceCad: 40,
    coverUrl: 'https://book-ye.com.ua/media/catalog/product/cache/79524a38d3bc3d0f3b6015a08841400c/2/9/29a42101-a3a1-11ed-817b-0050568ef5e6_42005899-edd5-11ee-8195-00505684ea69.jpg',
    genre: ['Детективи', 'Соціальний роман'],
    category: 'Українська література',
    tags: ['війна', 'розслідування'],
    description:
      'Місто під тиском війни, де кожне рішення може зламати тишу або врятувати життя.',
  },
  {
    id: 'Colleen-Hoover-bez-merit',
    title: 'Без Меріт',
    author: 'Коллін Гувер',
    priceCad: 40,
    coverUrl: 'https://knygaca.s3.amazonaws.com/knygaca-prod/media/assets/books/img/bez-merit.webp',
    genre: ['Соціальний роман', 'Психологія'],
    category: 'Зарубіжна література',
    tags: ['родина', 'самоприйняття'],
    description:
      'Дівчина вчиться називати речі своїми іменами, зшиваючи тріщини в родинній правді.',
  },
]

export default books




