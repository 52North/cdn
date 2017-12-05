var content = {};
var md = window.markdownit({html:true}).use(window.markdownitEmoji);

//clear menu
var menuElem = jQuery.find('#menu-main-menu-1')[0];
if (menuElem) {
  jQuery(menuElem).empty();    
} else {
  var sidebarElem = jQuery.find('aside.sidebar-primary')[0];
  jQuery(sidebarElem).append('<nav class="sidemenu"><ul id="menu-main-menu-1" class="menu"></ul></nav>');
  menuElem = jQuery.find('#menu-main-menu-1')[0];
}


jQuery(document).ready(function() {
    var menuEntries = mdMenuConfig.menuEntries;

    // create content entries
    jQuery.get(mdMenuConfig.rawReadmeMD, function(markdown) {
        if (markdown) {
            for (i = 0; i < menuEntries.length; i++) {
                content[menuEntries[i].key] = getSection(markdown, menuEntries[i].githubTitle);
            }
        }

        // create menu
        for (i = 0; i < menuEntries.length; i++) {
            if (menuEntries[i].link) {
                addMenuLinkEntry(menuEntries[i], menuElem);
            } else if (content[menuEntries[i].key]) {
                addMenuEntry(menuEntries[i], menuElem);
            }
        }
    
        // load first entry section
        var loadEntry = menuEntries[0];
        if (window.location.hash) {
            for (i = 0; i < menuEntries.length; i++) {
                if (menuEntries[i].key == window.location.hash.substring(1)) {
                    loadEntry = menuEntries[i];
                }
            }
        }
        loadSection(loadEntry);        
    });
});

// prepare breadcrumbs
var projectName = jQuery('.breadcrumb').contents().last().text().substring(3);
jQuery('.breadcrumb').contents().last().remove();
jQuery('.breadcrumb').append(document.createTextNode(' > '));
jQuery('.breadcrumb').append('<span class="breadcrumb-link-wrap" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem"><a href="' + window.location.origin + window.location.pathname + '" itemprop="item"><span itemprop="name">' + projectName + '</span></a></span>');

function addMenuEntry(entry, div) {
    if (entry.label) {
        var elem = jQuery('<li class="menu-item menu-item-type-post_type menu-item-object-page ' + entry.key + '"><a href="#' + entry.key + '" itemprop="url">' + entry.label + '</a></li>');
        elem.on('click', function() {
            loadSection(entry);
        })
        jQuery(div).append(elem);
    }
}

function addMenuLinkEntry(entry, div){
    jQuery(div).append('<li class="menu-item menu-item-type-post_type menu-item-object-page ' + entry.label + '"><a href="' + entry.link + '" itemprop="url">' + entry.label + '</a></li>');
}

function getSection(md, header) {
    var idx = md.indexOf('## ' + header);
    var begin = md.indexOf('\n', idx);
    var end = md.indexOf('\n## ', idx + 2);
    if (end < 0) {
        end = md.length;
    }
    return md.substring(begin, end).trim();
}

function loadSection(entry) {
    // remove active on other menu entries
    jQuery('li.current-menu-item').removeClass('current-menu-item');
    // mark menu entry
    jQuery('li.' + entry.key).toggleClass('current-menu-item');
    jQuery('#content').empty();
    // show label in header
    if (entry.label) {
      jQuery.find('.blox-caption-wrap')[0].innerText = entry.label;
    }
    // make first h3 to h2
    let contentText = md.render(content[entry.key]);
    contentText = contentText.replace('<h3>', '<h2>').replace('</h3>', '</h2>');
    jQuery('#content').append(contentText);
    // set title
    jQuery('.content .entry-title').text(entry.label);
    // breadcrumb
    if(jQuery('.breadcrumb').contents().last()[0].nodeType == 3) {
        jQuery('.breadcrumb').contents().last().remove();
    }   
    if (entry.label) {
        window.location.hash = entry.key;
        jQuery('.breadcrumb').append(document.createTextNode(' > ' + entry.label));    
    }
}
