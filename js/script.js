var app = {

    data: [],
    resultWindow: null,
    searchBar : null,
    current_nav_selection: null,
    filter_menu: {},
    list_checked_categories: {},

    init: function()
    {
        let that = this;

        $.get("data/data.json", function( data ) 
        {
            that.data = data.data;
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

    search: function(elem)
    {
        let that = this;
        let n_results = 0;

        $(this.resultWindow).empty().hide();

        let searchValue = $(elem).val();

        if(searchValue.length > 0)
        {
            for(let i = 0; i < that.data.length; i++)
            {
                if(that.data[i].text.toLowerCase().includes(searchValue.toLowerCase()))
                {
                    n_results += 1;
                    let new_line = $("<a href='#'>" + that.data[i].text + "</a><br>");
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

    menu: function(event)
    {
        let  that = this;

        event.preventDefault();

        let type  = $(event.target).data('type');
        let index = $(event.target).data('index');

        console.log(type,index);

        switch(type)
        {
            case 'category-top':

            break;

            case 'filter-option':

                let hr = $(event.target).next('hr');
                let su = $(event.target).next().next('div.subcat');
        
                if(!that.filter_menu[index] || that.filter_menu[index]==0)
                {
                    that.filter_menu[index] = 1;

                    $(hr).hide();
                    $(su).show();
                }
                else
                {
                    that.filter_menu[index] = 0;
        
                    $(hr).show();
                    $(su).hide();
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



     



    }
}


$(document).ready(function()
{
    app.init();

    $("nav ul li").mouseenter(function()
    {
        app.mouseenter(this);

    });

    $("nav ul li").mouseleave(function()
    {
        app.mouseleave(this);
    });

    $( "header .search .bar").on("keyup",function() 
    {
        app.search(this);
    });

    $("a").on("click",function(event)
    {
        app.menu(event);
    });
});