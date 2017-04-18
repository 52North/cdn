var content = {};
var md = window.markdownit().use(window.markdownitEmoji);

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
        var menuElem = jQuery.find('dl.level1')[0];
        jQuery(menuElem).empty();
        for (i = 0; i < menuEntries.length; i++) {
            if (content[menuEntries[i].key]) {
                addMenuEntry(menuEntries[i], menuElem);
            }
        }

        // load first entry section
        loadSection(menuEntries[0].key);
    });
});

function addMenuEntry(entry, div) {
    jQuery(div).append('<dt class="level1 parent opened forceopened first ' + entry.key + '"><span class="outer"><span class="inner"><a onclick="loadSection(\'' + entry.key + '\')"><span>' + entry.label + '</span></a></span></span></dt>');
    jQuery(div).append('<dd class="level1 notparent last"></dd>');
}

function getSection(md, header) {
    return md.substring(md.indexOf('\n', md.indexOf('## ' + header)), md.indexOf('\n## ', md.indexOf('## ' + header) + 2)).trim();
}

function loadSection(index) {
    // remove active on other menu entries
    jQuery('dl.level1 dt').removeClass('active');
    // mark menu entry
    jQuery('dt.' + index).toggleClass('active');
    jQuery('#content').empty();
    // content[index] = content[index].replace('&uuml;', '');
    jQuery('#content').append(md.render(content[index]));
}
