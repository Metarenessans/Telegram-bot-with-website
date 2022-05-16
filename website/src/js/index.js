import $ from 'jquery';
import 'jquery.maskedinput/src/jquery.maskedinput';
import 'wicg-inert';

console.log('It works!');

$('[type="tel"]')
  .mask('+7 (999) 999 9999')
  .on('click', function () {
    if (this.value === this.placeholder) {
      $(this).get(0).setSelectionRange(0, 0);
    }
  })
  .on('input', function(e) {
    let { value } = e.target;
    // Удаляет лишние символы
    value = value.replace(/(\+7|\s+|[()-])/g, '');
    // Стирает восьмерку в начале, если она есть
    if (value.length > 10) {
      value = value.slice(1);
    }
    console.log(value);
    this.value = value; 
  });

function scrollToElement(selector, callback) {
  $('html').animate({
    scrollTop: $(selector).offset().top + 'px'
  }, 500, callback);
}

$('a[href^="#"]').click(function (e) {
  e.preventDefault();
  scrollToElement($(this).attr('href'));
});

const $form = $('#form');

$('a[href="#section4"').on('click', function(e) {
  // Ставит фокус на первом интерактивном элементе
  const focusable = $form.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstFocusable = focusable[0];
  firstFocusable.focus();
});

function resetForm() {
  const button = $('button[type="submit"]');
  button.text('Отправить');
  button.prop('disabled', '');
}

$form.on('submit', e => {
  e.preventDefault();

  // Валидация
  let valid = true;

  const telInput = $('input[name="tel"]');
  const tel = telInput.val();
  if (tel.length === 0) {
    valid = false;
    telInput.attr('placeholder', 'Укажите телефон');
    telInput.addClass('error');
  }

  const nameInput = $('input[name="name"]');
  const name = nameInput.val();
  if (name.length === 0) {
    valid = false;
    nameInput.attr('placeholder', 'Укажите свое имя');
    nameInput.addClass('error');
  }

  if (!valid) {
    return;
  }

  nameInput.removeClass('error');
  telInput.removeClass('error');

  const data = { name, tel };
  $.ajax({
    type: 'GET',
    url: 'google-sheets.php',
    data,
    success: message => {
      ym(88671537, 'reachGoal', 'form-send');
      console.log(message);
      $('button[type="submit"]')
        .text('Спасибо за заявку!')
        .prop('disabled', 'true');
    },
    error: error => {
      console.error(error);
    }
  });
});
