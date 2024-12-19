var app = {

    data: null,
    resultWindow: null,
    searchBar : null,
    current_nav_selection: null,
    list_checked_categories: {},
    dataset: [],
    menu: 
    {
        filter:
        {
            index : {},
            active: {elem:null,index:0},
            is_busy : false
        }
    },

    init: function(js = false)
    {
        let ap = this;

        $.get("data/data.json", function( data ) 
        {
            ap.data = data;
            if(js) { ap.display(); }
        });


        this.resultWindow = $("header .search .result");
        this.searchBar    = $("header .search .bar");
        let position      = $("header .search .bar").offset();
        let height        = parseInt($("header .search .bar").css("height"));
        let width         = parseInt($("header .search .bar").css("width"));
        $("header .search .result").css({"left":position.left,"top":position.top + height + 5,"width":width});
    },

    mouseenter : function(elem)
    {
        let ap = this;

        if(ap.current_nav_selection !== null)
        {

        }

        ap.current_nav_selection = elem;
    },

    mouseleave: function(elem)
    {

    },

    search: function(elem,event)
    {
        let ap     = this;

        if(event.which == 13)
        {
            $(this.resultWindow).empty().hide();
            
            ap.display();
            return;
        }

        let n_results = 0;
        let articles  = ap.data.articles;

        $(this.resultWindow).empty().hide();

        let searchValue = $(elem).val();

        if(searchValue.length > 0)
        {
            ap.dataset = [];

            for(let i = 0; i < articles.length; i++)
            {
                if(articles[i].text.toLowerCase().includes(searchValue.toLowerCase()))
                {
                    ap.dataset.push(articles[i]);
                    n_results += 1;
                    let new_line = $("<a href='#'>" + articles[i].text + "</a><br>");
                    $(this.resultWindow).append(new_line);
                }

                if (n_results > 20) { break; }
            }
        }
    

        if(n_results > 0)
        {
            $(this.resultWindow).fadeIn();
        }
    },

    click: function(event)
    {
        var ap = this;

        event.preventDefault();

        let target = event.target;

        let type  = $(target).data('type');
        let index = $(target).data('index');

        if(typeof type === 'undefined')
        {
            target = $(event.target).closest('[data-type]');
            type   = $(target).data('type');
            index  = $(target).data('index');
        }

        console.log(type,index);

        switch(type)
        {
            case 'menu-top':
                ap.modal('open',"menu ::: top");
            break;

            case 'category-top':

            break;

            case 'filter-option':

                if(ap.menu.filter.is_busy) { return; }

                if(!ap.menu.filter.index[index])
                {

                    ap.menu.filter.index[index] = {'state':0,'hr':null,'subcat':null,'i':index};
                    ap.menu.filter.index[index].hr = $(event.target).next('hr');
                    ap.menu.filter.index[index].subcat = $(event.target).next().next('div.subcat');
                }

                if(ap.menu.filter.index[index].state == 0 && ap.menu.filter.active.index == 0)
                {
                    console.log("#slider 01");

                    $(ap.menu.filter.index[index].hr).hide();
                    $(ap.menu.filter.index[index].subcat).css('margin-top','20px');
                    $(ap.menu.filter.index[index].subcat).css('visibility','visible');

                    ap.menu.filter.is_busy = true;
                    ap.transform(ap.menu.filter.index[index].subcat,{'property':'height','currentHeight':0,'targetHeight':300,'speed':50},function()
                    {
                        console.log("#slider 02");

                        ap.menu.filter.index[index].state = 1;
                        ap.menu.filter.active.index = index;
                        ap.menu.filter.active.elem  = ap.menu.filter.index[index].subcat;
                        ap.menu.filter.is_busy = false;
                    });
                }
                else if(ap.menu.filter.index[index].state == 1)
                {
                    ap.menu.filter.is_busy = true;
                    ap.transform(ap.menu.filter.index[index].subcat,{'property':'height','currentHeight':300,'targetHeight':0,'speed':50},function()
                    {
                        $(ap.menu.filter.index[index].hr).show();
                        $(ap.menu.filter.index[index].subcat).css('margin-top','0px');
                        $(ap.menu.filter.index[index].subcat).css('visibility','hidden');

                        ap.menu.filter.index[index] = 0;
                        ap.menu.filter.active.index = 0;
                        ap.menu.filter.active.elem  = null;
                        ap.menu.filter.is_busy = false;
                    });
                }
                else if(ap.menu.filter.index[index].state == 0 && ap.menu.filter.active.index > 0)
                {
                    ap.menu.filter.is_busy = true;

                    let _index = ap.menu.filter.active.index;
                    let _elem  = ap.menu.filter.active.elem;

                    ap.transform(_elem,{'property':'height','currentHeight':300,'targetHeight':0,'speed':50},function()
                    {
                        $(ap.menu.filter.index[_index].hr).show();
                        $(ap.menu.filter.index[_index].subcat).css('margin-top','0px');
                        $(ap.menu.filter.index[_index].subcat).css('visibility','hidden');

                        ap.menu.filter.index[ap.menu.filter.active.index] = 0;
                        ap.menu.filter.active.index = 70;
                        ap.menu.filter.active.elem  = null;

                        $(ap.menu.filter.index[index].hr).hide();
                        $(ap.menu.filter.index[index].subcat).css('margin-top','20px');
                        $(ap.menu.filter.index[index].subcat).css('visibility','visible');
                        
                        ap.transform(ap.menu.filter.index[index].subcat,{'property':'height','currentHeight':0,'targetHeight':300,'speed':50},function()
                        {
                            ap.menu.filter.index[index].state = 1;
                            ap.menu.filter.active.index = index;
                            ap.menu.filter.active.elem  = ap.menu.filter.index[index].subcat;

                            ap.menu.filter.is_busy = false;
                        });
                    });
                }

            break;

            case 'category-left':

                if( !ap.list_checked_categories[index] || ap.list_checked_categories[index]==0 )
                {
                    let check = $(event.target).prev('b');

                    $(check).css({'color':'#32CD32'});
                   
                    ap.list_checked_categories[index] = 1;
                }
                else
                {
                    let check = $(event.target).prev('b');
                    $(check).css({'color':'white'});
                    ap.list_checked_categories[index] = 0;
                }

            break;
        
            case 'article-details':

                ap.load_template("articles.html",function(html)
                {
                    let content = $(html);
                    let article = ap.article_from_id(index);

                    console.log(article);

                    if(article.images)
                    {
                        let thumbnailContainer = $(".thumbnails",content);

                        console.log(thumbnailContainer);


                        for(let i = 0; i < article.images.length; i++)
                        {
                            let thumbnail = $("<img src='images/shop/" + article.images[i] + ".png'>");

                            $(thumbnail).on("click",function(event)
                            {
                                console.log(article.images[i]);

                                $(".picture",content).fadeOut(function()
                                {
                                    $(this).css("background-image", "url('images/shop/" + article.images[i] + ".png')").fadeIn();

                                }) 
                            });

                            $(thumbnailContainer).append(thumbnail);
                        }
                    }

                    let image = article.images ? article.images[0] : "0";

                    $(".picture",content).css("background-image", "url('images/shop/" + image + ".png')");
                    $(".picture",content).css("background-size", "cover"); // Optional, to make the image cover the div
                    $(".picture",content).css("background-position", "center");

                    let id     = 0;
                    let brand  = "<i>&#8226; not defined &#8226;</i>";
                    let desc   = "<i>&#8226; not defined &#8226;</i>";
                    let age    = "<i>&#8226; not defined &#8226;</i>";
                    let price  = "<i>&#8226; not defined &#8226;</i>";
                    let rating = "<i>&#8226; not defined &#8226;</i>";

                    if(article['id'])     { id     = article['id']; }
                    if(article['brand'])  { brand  = ap.data.brands[article.brand].name; }
                    if(article['text'])   { desc   = article['text']; }

                    if(article['age'])    
                    { 
                        if(article['age'].length == 1)
                        {
                            age = "Dès " + article['age'][0] + " ans";
                        }
                        else if(article['age'].length == 2)
                            {
                                age = "De " + article['age'][0] + " ans à " + article['age'][1] + " ans";
                            }
                        
                    }

                    if(article['price'])  
                    { 
                        let arr = (article['price'] + '').split('');
                        let secondToLastIndex = arr.length - 2;
                        arr.splice(secondToLastIndex, 0, ',');

                        price  = arr.join('') + " €"; 
                    }

                    if(article['rating']) 
                    { 
                        rating = "";

                        for(let i = 0; i < article['rating']; i++)
                        {
                            rating += "<i class='fa-solid fa-star'></i> ";
                        } 
                    }


                    $('button',content).data('index',id);
                    $('.brand',content).html(brand);
                    $('.desc',content).html(desc);
                    $('.age',content).html(age);
                    $('.price',content).html(price);
                    $('.rating',content).html(rating);
                    

                    ap.modal('open',content);
                });

            break;

            case 'screen':
                ap.modal('close');
            break;
        }

    },

    transform: function(elem,data,callback)
    {
        let ap = this;

        switch(data['property'])
        {
            case 'height':

                let currentHeight = data['currentHeight'];
                let targetHeight  = data['targetHeight'];

                if(currentHeight == targetHeight)
                {
                    console.log("#slider 03");

                    if(callback)
                    { 
                        callback(); 
                        
                    }
                }

                if(currentHeight < targetHeight)
                {
                    data['currentHeight'] = Math.ceil(currentHeight + ((targetHeight - currentHeight)/2));

                    $(elem).height(data['currentHeight']);

                    window.setTimeout(function()
                    {
                        ap.transform(elem,data,callback);
                    },data['speed']);

                    return;
                }

                if(currentHeight > targetHeight)
                {
                    data['currentHeight'] = Math.floor(currentHeight - ((currentHeight - targetHeight)/2)).toFixed(0);

                    $(elem).height(data['currentHeight']);

                    window.setTimeout(function()
                    {
                        ap.transform(elem,data,callback);
                    },data['speed']);

                    return;
                }

               

            break;
        }
    },

    display: function()
    {
        let ap     = this;
        let executed = false;
        let dataset  = ap.data.articles;

        if(ap.dataset.length > 0) { dataset = ap.dataset; }

        let elem = $("article.card")[0];

        let showroom = $("section.showroom");
        $(showroom).fadeOut(function()
        {
            $(showroom).empty();

            for(var i = 0; i < 8; i++)
            {
                if(dataset[i])
                {
                    let row    = dataset[i];
                    let sample = $(elem).clone(true);

                    let id     = 0;
                    let images = ["images/shop/0.png"];
                    let brand  = "<i>&#8226; not defined &#8226;</i>";
                    let desc   = "<i>&#8226; not defined &#8226;</i>";
                    let age    = "<i>&#8226; not defined &#8226;</i>";
                    let price  = "<i>&#8226; not defined &#8226;</i>";
                    let rating = "<i>&#8226; not defined &#8226;</i>";

                    if(row['id'])     { id = row['id']; }
                    if(row['images']) { $('img',sample).attr('src','images/shop/' + row.images[0] + '.png');   }
                    if(row['brand'])  { brand  = ap.data.brands[row.brand].name; }
                    if(row['text'])   { desc   = row['text']; }

                    if(row['age'])    
                    { 
                        if(row['age'].length == 1)
                        {
                            age = "Dès " + row['age'][0] + " ans";
                        }
                        else if(row['age'].length == 2)
                            {
                                age = "De " + row['age'][0] + " ans à " + row['age'][1] + " ans";
                            }
                        
                    }

                    if(row['price'])  
                    { 
                        let arr = (row['price'] + '').split('');
                        let secondToLastIndex = arr.length - 2;
                        arr.splice(secondToLastIndex, 0, ',');

                        price  = arr.join('') + " €"; 
                    }

                    if(row['rating']) 
                    { 
                        rating = "";

                        for(let i = 0; i < row['rating']; i++)
                        {
                            rating += "<i class='fa-solid fa-star'></i> ";
                        } 
                    }

                    $(sample).data('index',id);
                    $('button',sample).data('index',id);
                    $('.brand',sample).html(brand);
                    $('.desc',sample).html(desc);
                    $('.age',sample).html(age);
                    $('.price',sample).html(price);
                    $('.rating',sample).html(rating);


                    $(showroom).append(sample);

                    $(sample).on("click",function(event)
                    {
                        app.click(event);
                    });
                }
            }

            $(showroom).fadeIn();
        });
       




 
    },

    modal: function(action,content)
    {
        if(action == 'close')
        {
            $('#screen').fadeOut(function()
            {
                $(this).addClass('closed').removeClass('open')
            });

            $('#modal').fadeOut(function()
            {
                $('#modal .content').empty();
                $(this).addClass('closed').removeClass('open')
            });

            return;
        }

        if(action == 'open')
        {
            $('#screen').removeClass('closed').hide().addClass('open').fadeIn();
            $('#modal .content').append(content);
            $('#modal').removeClass('closed').hide().addClass('open').fadeIn();
        }
    },

    article_from_id: function(id)
    {
        let ap = this;

        for(let i = 0; i < ap.data.articles.length; i++ )
        {
            if(id == ap.data.articles[i].id)
            {
                return ap.data.articles[i];
            }
        }


    },

    load_template : function(file,callback)
    {
        $.get("templates/" + file, function(html) 
        {
            callback(html);
        });
    }
}

$(document).ready(function()
{
    app.init(true);

    $("nav ul li").mouseenter(function()
    {
        app.mouseenter(this);

    });

    $("nav ul li").mouseleave(function()
    {
        app.mouseleave(this);
    });

    $( "header .search .bar").on("keyup",function(e) 
    {
        app.search(this,e);
    });

    $("a").on("click",function(event)
    {
        app.click(event);
    });

    $("#screen").on("click",function(event)
    {
        app.click(event);
    });

    $(".close-button").on("click",function(event)
    {
        app.click(event);
    });
});

