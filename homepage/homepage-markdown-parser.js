var content = {};
var md = window.markdownit({html:true}).use(window.markdownitEmoji);

//clear menu
var menuElem = jQuery.find('dl.level1')[0];
jQuery(menuElem).empty();

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
        var elem = jQuery('<dt class="level1 parent opened forceopened first ' + entry.key + '"><span class="outer"><span class="inner"><a><span>' + entry.label + '</span></a></span></span></dt>');
        elem.on('click', function() {
            loadSection(entry);
        })
        jQuery(div).append(elem);
        jQuery(div).append('<dd class="level1 notparent last"></dd>');   
    }
}

function addMenuLinkEntry(entry, div){
    jQuery(div).append('<dt class="level1 parent opened forceopened first ' + entry.label + '"><span class="outer"><span class="inner"><a href="' + entry.link + '"><span>' + entry.label + '</span></a></span></span></dt>');
    jQuery(div).append('<dd class="level1 notparent last"></dd>');
}

function getSection(md, header) {
    return md.substring(md.indexOf('\n', md.indexOf('## ' + header)), md.indexOf('\n## ', md.indexOf('## ' + header) + 2)).trim();
}

function loadSection(entry) {
    // remove active on other menu entries
    jQuery('dl.level1 dt').removeClass('active');
    // mark menu entry
    jQuery('dt.' + entry.key).toggleClass('active');
    jQuery('#content').empty();
    // content[index] = content[index].replace('&uuml;', '');
    jQuery('#content').append(md.render(content[entry.key]));
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
