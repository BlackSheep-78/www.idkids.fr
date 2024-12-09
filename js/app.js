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
        let that = this;

        $.get("data/data.json", function( data ) 
        {
            that.data = data;
            if(js) { that.display(); }
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
        let that = this;

        if(that.current_nav_selection !== null)
        {

        }

        that.current_nav_selection = elem;
    },

    mouseleave: function(elem)
    {

    },

    search: function(elem,event)
    {
        let that     = this;

        if(event.which == 13)
        {
            $(this.resultWindow).empty().hide();
            
            that.display();
            return;
        }

        let n_results = 0;
        let articles  = that.data.articles;

        $(this.resultWindow).empty().hide();

        let searchValue = $(elem).val();

        if(searchValue.length > 0)
        {
            that.dataset = [];

            for(let i = 0; i < articles.length; i++)
            {
                if(articles[i].text.toLowerCase().includes(searchValue.toLowerCase()))
                {
                    that.dataset.push(articles[i]);
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
        var that = this;

        event.preventDefault();

        let type  = $(event.target).data('type');
        let index = $(event.target).data('index');

        console.log(type,index);

        switch(type)
        {
            case 'category-top':

            break;

            case 'filter-option':

                if(that.menu.filter.is_busy) { return; }

                if(!that.menu.filter.index[index])
                {

                    that.menu.filter.index[index] = {'state':0,'hr':null,'subcat':null,'i':index};
                    that.menu.filter.index[index].hr = $(event.target).next('hr');
                    that.menu.filter.index[index].subcat = $(event.target).next().next('div.subcat');
                }

                if(that.menu.filter.index[index].state == 0 && that.menu.filter.active.index == 0)
                {
                    console.log("#slider 01");

                    $(that.menu.filter.index[index].hr).hide();
                    $(that.menu.filter.index[index].subcat).css('margin-top','20px');
                    $(that.menu.filter.index[index].subcat).css('visibility','visible');

                    that.menu.filter.is_busy = true;
                    that.transform(that.menu.filter.index[index].subcat,{'property':'height','value':300,'speed':50},function()
                    {
                        console.log("#slider 02");

                        that.menu.filter.index[index].state = 1;
                        that.menu.filter.active.index = index;
                        that.menu.filter.active.elem  = that.menu.filter.index[index].subcat;
                        that.menu.filter.is_busy = false;
                    });
                }
                else if(that.menu.filter.index[index].state == 1)
                {
                    that.menu.filter.is_busy = true;
                    that.transform(that.menu.filter.index[index].subcat,{'property':'height','value':0,'speed':50},function()
                    {
                        $(that.menu.filter.index[index].hr).show();
                        $(that.menu.filter.index[index].subcat).css('margin-top','0px');
                        $(that.menu.filter.index[index].subcat).css('visibility','hidden');

                        that.menu.filter.index[index] = 0;
                        that.menu.filter.active.index = 0;
                        that.menu.filter.active.elem  = null;
                        that.menu.filter.is_busy = false;
                    });
                }
                else if(that.menu.filter.index[index].state == 0 && that.menu.filter.active.index > 0)
                {
                    that.menu.filter.is_busy = true;

                    let _index = that.menu.filter.active.index;
                    let _elem = that.menu.filter.active.elem;

                    that.transform(_elem,{'property':'height','value':0,'speed':50},function()
                    {
                        $(that.menu.filter.index[_index].hr).show();
                        $(that.menu.filter.index[_index].subcat).css('margin-top','0px');
                        $(that.menu.filter.index[_index].subcat).css('visibility','hidden');

                        that.menu.filter.index[that.menu.filter.active.index] = 0;
                        that.menu.filter.active.index = 70;
                        that.menu.filter.active.elem  = null;

                        $(that.menu.filter.index[index].hr).hide();
                        $(that.menu.filter.index[index].subcat).css('margin-top','20px');
                        $(that.menu.filter.index[index].subcat).css('visibility','visible');
                        
                        that.transform(that.menu.filter.index[index].subcat,{'property':'height','value':300,'speed':50},function()
                        {
                            that.menu.filter.index[index].state = 1;
                            that.menu.filter.active.index = index;
                            that.menu.filter.active.elem  = that.menu.filter.index[index].subcat;

                            that.menu.filter.is_busy = false;
                        });
                    });
                }

            break;

            case 'category-left':

                if( !that.list_checked_categories[index] || that.list_checked_categories[index]==0 )
                {
                    let check = $(event.target).prev('i');
                    $(check).addClass('fa-solid');
                    $(check).addClass('fa-check');
                    that.list_checked_categories[index] = 1;
                }
                else
                {
                    let check = $(event.target).prev('i');
                    $(check).removeClass('fa-solid fa-check');
                    that.list_checked_categories[index] = 0;
                }

            break;
        }

    },

    transform: function(elem,data,callback)
    {
        let that = this;

        switch(data['property'])
        {
            case 'height':

                let currentHeight = $(elem).height();
                let targetHeight = data['value'];

                console.group(currentHeight,targetHeight);

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
                    $(elem).height(Math.ceil(currentHeight + Math.ceil((targetHeight - currentHeight)/2)));

                    window.setTimeout(function(){
                        that.transform(elem,data,callback);
                    },data['speed']);

                    return;
                }

                if(currentHeight > targetHeight)
                {
                    $(elem).height(Math.floor(currentHeight - ((currentHeight - targetHeight)/2)));

                    window.setTimeout(function()
                    {
                        that.transform(elem,data,callback);
                    },data['speed']);

                    return;
                }

               

            break;
        }
    },

    display: function()
    {
        let that     = this;
        let executed = false;
        let dataset  = that.data.articles;

        if(that.dataset.length > 0) { dataset = that.dataset; }

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

                    let images = ["images/shop/0.png"];
                    let brand  = "<i>&#8226; not defined &#8226;</i>";
                    let desc   = "<i>&#8226; not defined &#8226;</i>";
                    let age    = "<i>&#8226; not defined &#8226;</i>";
                    let price  = "<i>&#8226; not defined &#8226;</i>";
                    let rating = "<i>&#8226; not defined &#8226;</i>";

                    if(row['images']) { $('img',sample).attr('src','images/shop/' + row.images[0] + '.png');   }

                    if(row['brand'])  { brand  = that.data.brands[row.brand].name; }
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

                        console.log(row['rating']);

                        for(let i = 0; i < row['rating']; i++)
                        {
                            rating += "<i class='fa-solid fa-star'></i> ";
                        } 
                    }

                    $('.brand',sample).html(brand);
                    $('.desc',sample).html(desc);
                    $('.age',sample).html(age);
                    $('.price',sample).html(price);
                    $('.rating',sample).html(rating);

                    $(showroom).append(sample);
                }
            }

            $(showroom).fadeIn();
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
});