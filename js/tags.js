$(function() {
  var tagForm = $('.tag-form'),
    input = tagForm.find('input[type=text]'),
    submit = tagForm.find('button[type=submit]'),
    tags = tagForm.find('.tag-form-tags'),
    inputGroup = tagForm.find('.input-group'),
    taglist = [],
    body = $(document.body);

  allowedTags = body.attr('data-tags');

  if (allowedTags !== undefined) {
    allowedTags = allowedTags.split(' ').map(function(tag) { return tag.trim(); }).filter(function(tag) { return tag !== ''; }).sort();
  }

  var listItems = {};
  for (var i = 0, l = allowedTags.length; i < l; i++) {
    var el = $('<li></li>');
    el.addClass('list-group-item tag-list-item');
    el.text(allowedTags[i]);
    listItems[allowedTags[i]] = el;
  }

  var list = $('<ul></ul>');
  list.addClass('list-group tag-form-list');
  list.css('display', 'none');
  list.appendTo(body);

  list.on('click', '.list-group-item', function() {
    input.val($(this).text());
    tagForm.submit();
  });

  function remove(array, item) {
    var index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
    return array;
  }

  function contains(array, item) {
    return array.indexOf(item) !== -1;
  }

  function addTag(tag) {
    var className = 'tagged-' + tag;
    body.removeClass('untagged');
    if (!body.hasClass(className)) {
      body.addClass(className);
      taglist.push(tag);

      var tagEl = $('<button></button>');
      tagEl.addClass('btn btn-primary');
      tagEl.text(tag + ' ');
      tagEl.on('click', function() {
        tagEl.remove();
        remove(taglist, tag);
        body.removeClass(className);
        if (taglist.length === 0) {
          body.addClass('untagged');
        }
        updateHash();
      });

      var icon = $('<span></span>');
      icon.addClass('glyphicon glyphicon-remove');
      icon.appendTo(tagEl);

      tagEl.appendTo(tags);
      tags.append(' ');

      updateHash();

      input.val('');
    }

    hideList();
  }

  function updateHash() {
    if (taglist.length === 0) {
      window.location.hash = '';
    } else {
      window.location.hash = '/tagged/' + taglist.join(',');
    }
  }

  function showList() {
    var bbox = inputGroup[0].getBoundingClientRect();
    list.width(bbox.width);
    list.css({'display': 'block', 'left': bbox.left});
    filterList(input.val());
  }

  function hideList() {
    list.css('display', 'none');
  }

  function filterList(search) {
    var filtered = allowedTags.filter(function(tag) { return !contains(taglist, tag); });
    if (search !== '') {
      filtered = fuzzy.filter(search, filtered).map(function(res) { return res.original; });
    }
    list.children().detach();
    for (var i = 0, l = filtered.length; i < l; i++) {
      listItems[filtered[i]].appendTo(list);
    }

    return filtered;
  }

  var m = window.location.hash.match(/^#\/tagged\/([\s\S]+)$/);

  if (m) {
    var hashTags = m[1].split(',');
    for (i = 0, l = hashTags.length; i < l; i++) {
      if (hashTags[i] !== '') {
        addTag(hashTags[i]);
      }
    }
  }

  tagForm.on('submit', function(e) {
    e.preventDefault();
    var tag = input.val().trim();

    if (contains(allowedTags, tag)) {
      addTag(tag);
    }
  });

  input.on('keydown', function(e) {
    console.log(e.which);
    var triggers = [32, 44, 27, 13, 9];
    if (contains(triggers, e.which)) {
      e.preventDefault();
      if (e.which !== 27) {
        var l = filterList(input.val());
        if (l.length === 1) {
          input.val(l[0]);
        }
        input.focus();
        setTimeout(function() {
          tagForm.trigger('submit');
          showList();
        }, 1);
      } else {
        input.blur();
        hideList();
      }
    }
  });

  input.on('keyup', function() {
    filterList(input.val());
  });

  input.on('focus', function() {
    showList();
  });

  input.on('blur', function() {
    setTimeout(function() { hideList(); }, 300);
  });
});
