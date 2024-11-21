var app = {

    data: [],
    resultWindow: null,
    searchBar : null,
    current_nav_selection: null,

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
});