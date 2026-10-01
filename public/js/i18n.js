const STR = {
  ru: {
    title: 'Кексомагия',
    subtitle: 'Испеки мультяшный кекс. Испортить невозможно — мы проверяли.',
    start: 'Печём!',
    steps: ['Начинка', 'Тесто', 'Печь', 'Украшение', 'Та-дам!'],
    next: 'Дальше →',
    back: '← Назад',
    sound: 'Звук',

    'filling.title': 'Выбери начинку',
    'filling.apple': 'Яблочный', 'filling.apple.tag': 'Хрустящие яблочки и щепотка корицы',
    'filling.citrus': 'Цитрусовый', 'filling.citrus.tag': 'Апельсин + лимон = карманное солнце',
    'filling.chocolate': 'Шоколадный', 'filling.chocolate.tag': 'Тройной шоколадный удар',
    'filling.plum': 'Сливовый', 'filling.plum.tag': 'Сочная слива с фиолетовым секретом',

    'mix.title': 'Замешай тесто',
    'mix.hint': 'Кидай что хочешь и сколько хочешь — миска волшебная. Потом мешай: держи кнопку или крути пальцем по миске.',
    'ing.flour': 'Мука', 'ing.eggs': 'Яйца', 'ing.butter': 'Масло', 'ing.sugar': 'Сахар', 'ing.filling': 'Начинка',
    'mix.stir': 'Мешать (держи)',
    'mix.progress': 'Волшебность теста',

    'bake.title': 'В печь!',
    'bake.hint': 'Доставай когда хочешь. Эта печь физически не умеет сжигать.',
    'bake.start': 'Запечь 🔥',
    'bake.take': 'Достать!',
    'bake.temp': 'Температура',
    'bake.magic': 'магия',
    'bake.progress': 'Готовность',

    'deco.title': 'Укрась',
    'tab.glaze': 'Глазурь', 'tab.sprinkles': 'Посыпка', 'tab.toppings': 'Сверху', 'tab.face': 'Мордочка', 'tab.magic': 'Магия',
    'glaze.none': 'Без', 'glaze.vanilla': 'Ваниль', 'glaze.pink': 'Розовая', 'glaze.lemon': 'Лимонная', 'glaze.mint': 'Мятная',
    'glaze.choco': 'Шоколад', 'glaze.rainbow': 'Радуга', 'glaze.galaxy': 'Космос',
    'spr.none': 'Без', 'spr.rainbow': 'Радужная', 'spr.choco': 'Шоколадная', 'spr.stars': 'Звёздочки', 'spr.hearts': 'Сердечки',
    'spr.powder': 'Сахарная пудра', 'spr.gold': 'Золотая пыль',
    'top.cherry': 'Вишня', 'top.strawberry': 'Клубника', 'top.orange': 'Апельсин', 'top.lemon': 'Лимон', 'top.apple': 'Яблоко',
    'top.plum': 'Слива', 'top.chocolate': 'Шоколадка', 'top.marshmallow': 'Зефирка', 'top.mint': 'Мята', 'top.cookie': 'Печенька',
    'top.clear': 'Снять всё сверху',
    'face.eyes': 'Глаза', 'face.mouth': 'Рот',
    'eyes.big': 'Круглые', 'eyes.sparkle': 'Звёзды', 'eyes.happy': 'Счастье', 'eyes.hearts': 'Любовь',
    'mouth.smile': 'Улыбка', 'mouth.grin': 'Ха-ха', 'mouth.cat': 'Мур', 'mouth.tongue': 'Бе-бе',
    'x.wings': 'Крылья', 'x.crown': 'Корона', 'x.halo': 'Нимб', 'x.rainbow': 'Радуга', 'x.candles': 'Свечки', 'x.glasses': 'Очки',
    'deco.surprise': 'Сюрприз! 🎲',
    'deco.reset': 'Сбросить',
    'deco.done': 'Готово! ✨',

    'reveal.score': 'Оценка шефа',
    'reveal.cut': 'Разрезать 🔪',
    'reveal.save': 'Сохранить картинку',
    'reveal.again': 'Испечь ещё',
    'reveal.shelf': 'Твоя кексотека',
    'reveal.outOf': 'из 10',

    name: {
      adj: ['Легендарный', 'Облачный', 'Космический', 'Хохочущий', 'Сияющий', 'Королевский', 'Пушистый', 'Танцующий',
        'Мурлыкающий', 'Невозможный', 'Радужный', 'Волшебный', 'Летучий', 'Бархатный'],
      noun: ['Кекс', 'Кексище', 'Кексолёт', 'Кексозавр', 'Кекс-Облако', 'Кексонавт', 'Кексик'],
      filling: { apple: 'с яблоками', citrus: 'с апельсином и лимоном', chocolate: 'с шоколадом', plum: 'со сливой' },
    },

    chef: {
      welcome: ['Мяу! Я шеф Мурзик. Сегодня ты печёшь кекс, и он будет великолепен. Это не обсуждается.'],
      filling: ['Отличный выбор! Других у нас и не бывает.'],
      'pick.apple': ['Яблочки! Хрум-хрум, мур-мур.'],
      'pick.citrus': ['Апельсин и лимон — дуэт года!'],
      'pick.chocolate': ['Шоколад! Мои усы дрожат от восторга.'],
      'pick.plum': ['Слива! Фиолетовый — цвет настоящих волшебников.'],
      mix: ['Сыпь всё в миску! Пропорции — для зануд.'],
      add: ['Бульк!', 'Шлёп!', 'Прекрасно!', 'Миска довольна.', 'Ещё? Можно!', 'Плюх!'],
      tooMuch: ['Много? Миска-балансир всё выровняет ✨', 'Ого, щедро! Волшебная миска уже уравновесила.'],
      autoAdd: ['Чего-то не хватало — миска сама докинула. Она умная.'],
      stirDone: ['Тесто — шёлк! Даже облака завидуют.'],
      bake: ['Ставим в печь. Она слишком добрая, чтобы что-то сжечь.'],
      early: ['Рано? Не бывает! Печные феи допекли за секунду ✨'],
      good: ['Идеально! Золотистый, как рассвет.'],
      auto: ['Дзынь! Печь сама знает, когда хватит.'],
      deco: ['Время красоты! Тут нельзя ошибиться, честно-честно.'],
      full: ['Места мало — уберу самое старое, чтобы было красиво.'],
      surprise: ['Шеф рекомендует!', 'Мяу, это шедевр!', 'Вот так — и в музей.'],
      reveal: ['Это лучший кекс, что я видел. А я видел кексы.', 'Плачу от счастья. Мур.', 'Шедевр! Подаю заявку в Лувр.',
        'Я бы поставил 12, но шкала кончилась.', 'Этот кекс улыбается мне. Я улыбаюсь ему.'],
      cut: ['Внутри — чистая магия. Смотри, какая начинка!'],
      saved: ['Картинка сохранена. Покажи всем!'],
    },
  },

  en: {
    title: 'Cake Magic',
    subtitle: 'Bake a cartoon loaf cake. Ruining it is impossible — we checked.',
    start: "Let's bake!",
    steps: ['Filling', 'Batter', 'Oven', 'Decorate', 'Ta-da!'],
    next: 'Next →',
    back: '← Back',
    sound: 'Sound',

    'filling.title': 'Pick a filling',
    'filling.apple': 'Apple', 'filling.apple.tag': 'Crunchy apples and a pinch of cinnamon',
    'filling.citrus': 'Citrus', 'filling.citrus.tag': 'Orange + lemon = pocket sunshine',
    'filling.chocolate': 'Chocolate', 'filling.chocolate.tag': 'Triple chocolate punch',
    'filling.plum': 'Plum', 'filling.plum.tag': 'Juicy plum with a purple secret',

    'mix.title': 'Make the batter',
    'mix.hint': 'Toss in anything, any amount — the bowl is magic. Then stir: hold the button or swirl your finger over the bowl.',
    'ing.flour': 'Flour', 'ing.eggs': 'Eggs', 'ing.butter': 'Butter', 'ing.sugar': 'Sugar', 'ing.filling': 'Filling',
    'mix.stir': 'Stir (hold)',
    'mix.progress': 'Batter magic',

    'bake.title': 'Into the oven!',
    'bake.hint': 'Take it out whenever. This oven is physically incapable of burning things.',
    'bake.start': 'Bake 🔥',
    'bake.take': 'Take it out!',
    'bake.temp': 'Temperature',
    'bake.magic': 'magic',
    'bake.progress': 'Doneness',

    'deco.title': 'Decorate',
    'tab.glaze': 'Glaze', 'tab.sprinkles': 'Sprinkles', 'tab.toppings': 'Toppings', 'tab.face': 'Face', 'tab.magic': 'Magic',
    'glaze.none': 'None', 'glaze.vanilla': 'Vanilla', 'glaze.pink': 'Pink', 'glaze.lemon': 'Lemon', 'glaze.mint': 'Mint',
    'glaze.choco': 'Chocolate', 'glaze.rainbow': 'Rainbow', 'glaze.galaxy': 'Galaxy',
    'spr.none': 'None', 'spr.rainbow': 'Rainbow', 'spr.choco': 'Chocolate', 'spr.stars': 'Stars', 'spr.hearts': 'Hearts',
    'spr.powder': 'Icing sugar', 'spr.gold': 'Gold dust',
    'top.cherry': 'Cherry', 'top.strawberry': 'Strawberry', 'top.orange': 'Orange', 'top.lemon': 'Lemon', 'top.apple': 'Apple',
    'top.plum': 'Plum', 'top.chocolate': 'Chocolate', 'top.marshmallow': 'Marshmallow', 'top.mint': 'Mint', 'top.cookie': 'Cookie',
    'top.clear': 'Clear toppings',
    'face.eyes': 'Eyes', 'face.mouth': 'Mouth',
    'eyes.big': 'Round', 'eyes.sparkle': 'Stars', 'eyes.happy': 'Joy', 'eyes.hearts': 'Love',
    'mouth.smile': 'Smile', 'mouth.grin': 'Ha-ha', 'mouth.cat': 'Purr', 'mouth.tongue': 'Bleh',
    'x.wings': 'Wings', 'x.crown': 'Crown', 'x.halo': 'Halo', 'x.rainbow': 'Rainbow', 'x.candles': 'Candles', 'x.glasses': 'Shades',
    'deco.surprise': 'Surprise! 🎲',
    'deco.reset': 'Reset',
    'deco.done': 'Done! ✨',

    'reveal.score': "Chef's score",
    'reveal.cut': 'Cut it 🔪',
    'reveal.save': 'Save picture',
    'reveal.again': 'Bake another',
    'reveal.shelf': 'Your cake shelf',
    'reveal.outOf': 'out of 10',

    name: {
      adj: ['Legendary', 'Cloudy', 'Cosmic', 'Giggling', 'Shining', 'Royal', 'Fluffy', 'Dancing', 'Purring', 'Impossible',
        'Rainbow', 'Magical', 'Flying', 'Velvet'],
      noun: ['Cake', 'Megaloaf', 'Loafcopter', 'Cakeasaurus', 'Cloud Loaf', 'Cakenaut', 'Cakelet'],
      filling: { apple: 'with Apples', citrus: 'with Orange & Lemon', chocolate: 'with Chocolate', plum: 'with Plums' },
    },

    chef: {
      welcome: ["Meow! I'm Chef Murzik. Today you bake a loaf cake and it will be magnificent. Not up for debate."],
      filling: ['Great choice! We only have great choices.'],
      'pick.apple': ['Apples! Crunch-crunch, purr-purr.'],
      'pick.citrus': ['Orange and lemon — duo of the year!'],
      'pick.chocolate': ['Chocolate! My whiskers are trembling.'],
      'pick.plum': ['Plum! Purple is the colour of real wizards.'],
      mix: ['Throw it all in! Ratios are for bores.'],
      add: ['Bloop!', 'Splat!', 'Lovely!', 'The bowl is pleased.', 'More? Sure!', 'Plop!'],
      tooMuch: ['A lot? The balancing bowl evens it out ✨', 'Generous! The magic bowl already balanced it.'],
      autoAdd: ['Something was missing — the bowl added it itself. Clever bowl.'],
      stirDone: ['Silky batter! Even clouds are jealous.'],
      bake: ['Into the oven. It is far too kind to burn anything.'],
      early: ['Too early? No such thing! The oven fairies finished it in a blink ✨'],
      good: ['Perfect! Golden like sunrise.'],
      auto: ['Ding! The oven knows when it is done.'],
      deco: ['Beauty time! You genuinely cannot get this wrong.'],
      full: ["Running out of room — I'll move the oldest one so it stays pretty."],
      surprise: ['Chef recommends!', 'Meow, a masterpiece!', 'Like that — straight to the museum.'],
      reveal: ["Best cake I've ever seen. And I've seen cakes.", 'Crying happy tears. Purr.', 'Masterpiece! Submitting it to the Louvre.',
        "I'd give it 12, but the scale ran out.", 'This cake is smiling at me. I am smiling back.'],
      cut: ['Pure magic inside. Look at that filling!'],
      saved: ['Picture saved. Show everyone!'],
    },
  },
};

const LS_KEY = 'cake-lang';
let lang = (() => {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved && STR[saved]) return saved;
  } catch {}
  return (navigator.language || 'en').toLowerCase().startsWith('ru') ? 'ru' : 'en';
})();

export const getLang = () => lang;
export function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  try { localStorage.setItem(LS_KEY, l); } catch {}
}
export const t = (key) => STR[lang][key] ?? STR.en[key] ?? key;
export const chefLines = (key) => STR[lang].chef[key] || STR.en.chef[key] || [''];
export const nameParts = () => STR[lang].name;
