/* global articles Article*/

'use strict';

const articleView = {};


articleView.populateFilters = () => {
    $('article').each(function () {
        let val = $(this).find('address a').text();
        let optionTag = `<option value="${val}">${val}</option>`;

        if ($(`#author-filter option[value="${val}"]`).length === 0) {
            $('#author-filter').append(optionTag);
        }

        val = $(this).attr('data-category');
        optionTag = `<option value="${val}">${val}</option>`;
        if ($(`#category-filter option[value="${val}"]`).length === 0) {
            $('#category-filter').append(optionTag);
        }
    });
};

articleView.handleAuthorFilter = () => {
    $('#author-filter').on('change', function () {
        if ($(this).val()) {
            $('article').hide();
            $(`article[data-author="${$(this).val()}"]`).fadeIn();
        } else {
            $('article').fadeIn();
            $('article.template').hide();
        }
        $('#category-filter').val('');
    });
};

articleView.handleCategoryFilter = () => {
    $('#category-filter').on('change', function () {
        if ($(this).val()) {
            $('article').hide();
            $(`article[data-category="${$(this).val()}"]`).fadeIn();
        } else {
            $('article').fadeIn();
            $('article.template').hide();
        }
        $('#author-filter').val('');
    });
};

articleView.handleMainNav = () => {
    $('.main-nav').on('click', '.tab', function () {
        $('.tab-content').hide();
        $(`#${$(this).attr('data-content')}`).fadeIn();
    });

    $('.main-nav .tab:first').click();
};

articleView.setTeasers = () => {
    $('.article-body *:nth-of-type(n+2)').hide();
    $('article').on('click', 'a.read-on', function (e) {
        e.preventDefault();
        if ($(this).text() === 'Read on →') {
            $(this).parent().find('*').fadeIn();
            $(this).html('Show Less &larr;');
        } else {
            $('body').animate({
                scrollTop: ($(this).parent().offset().top)
            }, 200);
            $(this).html('Read on &rarr;');
            $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
        }
    });
};

// COMMENT: Where is this function called? Why?
// This function is called in index.html, at the end. The purpose is to run specific js code on that page. Because we're using multiple js files for
// multiple pages, we have access to code from both pages that we may not necessarily use on that particular page. This function allows us to specify.
articleView.initIndexPage = () => {
    // REVIEW: We can write an arrow function in one line, without the code block, making the code easier to read. With an arrow function, the 'return' is implicit, we can remove it as well.
    // The .sort() method will rearrange the order of elements in the array and return the original array. This method does not make a copy. See the MDN docs for more details.
    rawData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)));

    rawData.forEach(articleObject => articles.push(new Article(articleObject)));

    articles.forEach(article => $('#articles').append(article.toHtml()));

    articleView.populateFilters();
    articleView.handleCategoryFilter();
    articleView.handleAuthorFilter();
    articleView.handleMainNav();
    articleView.setTeasers();
};

// COMMENT: Where is this function called? Why?
// This function is called in the new.html page. It serves the same purpose as above.
articleView.initNewArticlePage = () => {
    // TODONE: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
    articleView.handleMainNav();

    // The new articles we create will be given to the user as JSON so they can copy/paste it into their source data file.
    // STRETCHNE: Hide the export section for now, and show it once we have data to export.
    // This is done.
    $('#article-json').on('focus', function () {
        this.select();
    });

    // TODONE: Add an event handler to update the preview (STRETCHNE: and the export field) if any inputs change.
    $('#new-article').on('change', function(){articleView.create();});
};

articleView.create = () => {
    // TODONE: Set up a variable to hold the new article we are creating.
    const newArticle = {
        title: $('#new-title').val(),
        category: $('#new-category').val(),
        author: $('#new-author').val(),
        authorUrl: $('#new-website').val(),
        publishedOn: '2018-03-01',
        body: marked($('#new-body').val())
    };

    // Clear out the #articles element, so we can put in the updated preview

    // TODONE: Instantiate an article based on what's in the form fields:
    $('#articles').show();
    $('#article-export').show();
    $('#preview-article h1').text(newArticle.title);
    $('#preview-article .article-body').html(newArticle.body);
    $('#preview-article article').attr('data-author', (newArticle.author));
    $('#preview-article .byline a').text(newArticle.author);
    $('#preview-article .byline a').attr('href', newArticle.authorUrl);
    $('#preview-article article').attr('data-category', (newArticle.category));

    // TODONE: Use our interface to the Handlebars template to put this new article into the DOM:
    // NOTE: I did this procedurally using the above code.

    // STRETCHNE: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
    // $('pre code').each();

    // STRETCHNE: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
    $('#article-json').val(`${JSON.stringify(newArticle, true, 2)},`);

};
