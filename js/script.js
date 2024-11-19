var app = {

    resultWindow: null,
    searchBar : null,
    current_nav_selection: null,

    init: function()
    {
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
            $(that.current_nav_selection).css("background-color","#ffffff");
            $(that.current_nav_selection).find("a").css("color","grey");
        }

        that.current_nav_selection = elem;

        $(elem).css("background-color","#8fd9fb");
        $(elem).find("a").css("color","#ffffff");

        let selectorId = $(elem).attr("data-id");

        selectorId = selectorId.split('-')[1];

        $("header nav .options .content").hide();

        $("#content-" +  selectorId).fadeIn();
    },

    mouseleave: function(elem)
    {

    },

    search: function(elem)
    {
        let value = $(elem).val();
        console.log(value);
        let new_line = $("<p>" + value + "</p>");
        $(this.resultWindow).append(new_line).fadeIn();

        if(value.length == 0)
        {
            $(this.resultWindow).empty().fadeOut();
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

    $("header .search .bar")

    $( "header .search .bar").on("keyup",function() 
    {
        app.search(this);
    });
});