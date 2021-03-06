class selector {
    constructor(e) {
        let t = this;
        $.fn.ac = $.fn.addClass, $.fn.rc = $.fn.removeClass, t._o = Object.assign({
            onHoverNode: function (e) {},
            onOpen: function (e) {},
            onClose: function (e) {},
            onChange: function (e) {},
            onToggleGroup: function (e) {},
            enableSearch: !1,
            renewSearch: !0,
            caseSensitive: !1,
            matchingFunction: function (e, o) {
                var s = e => t.caseSensitive ? e : e.toLowerCase();
                return s(e.substring(0, o.length)) == s(o)
            },
            target: "",
            shorthandDescriptors: {
                option: "opt",
                group: "group",
                value: "v"
            }
        }, e);
        let o = t._o.shorthandDescriptors.option,
            s = t._o.shorthandDescriptors.group,
            n = t._o.renewSearch;
        t.id = Math.random().toString(36).substring(2, 15), t.target = e.target, t.o = $(`<div class='custom_select_details' data-opener-for='${t.id}'>${t.target.html()}</div>`), t.o.find(s).on("click", function (e) {
            $(e.target).is(s) && ($(this).toggleClass("is_closed"), t._o.onToggleGroup({
                target: this,
                isClosed: $(this).is(".is_closed")
            }))
        }), $(document.body).append(t.o), t.target.prop("id", t.id).click(e => {
            t.toggle(e)
        }).find("*").remove().addBack().append(`<div class='value_inner' data-selector-for="${t.id}"></div>`), t.open = !1, t.s = t.o.find(`${0==t.o.find("[selected]").length?o:"[selected]"}`).eq(0).ac("active"), t.value = t.s.attr("value") || t.s.text(), t.change_to(t.s.html()), t.all = t.o.find(`${o}:not([disabled])`), t.all.click(e => {
            t.change(e)
        }).mouseenter(e => {
            t.focus_node($(e.target))
        }), t.last_key_search = ["", 0, t.s], $(document.body).on("keydown", function (ev) {
            if (t.open) {
                let s = `${o}:visible:not([disabled])`,
                    a = ev.key;
                if ("ArrowDown" == a) {
                    ev.preventDefault()
                    let e = t.s.nextAll(s).eq(0),
                        n = 0 == e.length ? t.o.find(`${o}:first-of-type`) : e;
                    t.focus_node(n), t.scrollTo(n)
                } else if ("ArrowUp" == a) {
                    ev.preventDefault()
                    let e = t.s.prevAll(s).eq(0),
                        n = 0 == e.length ? t.o.find(`${o}:last-of-type`) : e;
                    t.focus_node(n), t.scrollTo(n)
                } else if ("Enter" == a) t.change({
                    target: t.s
                });
                else if (1 == a.length || "Backspace" == a) {
                    let e = t.last_key_search;
                    e[1] = e[0] == a && e[2] == t.s ? e[1] + 1 : 0, e[0] = n ? a : "Backspace" == a ? e[0].substr(0, e[0].length - 1) : e[0] + a, !n && $(`.value_inner[data-selector-for="${t.id}"]`).attr("data-search-term", e[0]);
                    let o = t.find(e[0], e[1]);
                    o && o[1] ? (t.scrollTo($(o[1])), t.focus_node($(o[1])), e[2] = t.s) : n && (e[0] = "")
                } else "Escape" == a && t.toggle({
                    target: t.s
                })
            }
        })
    }
    find(e, t = 0) {
        let o = this,
            s = o.o.find(o._o.shorthandDescriptors.option),
            n = Object.values(s).map(e => [e.innerText, e]).filter(t => t[0] && o._o.matchingFunction(t[0], e));
        return s.rc("hidden_by_search"), 0 == o._o.renewSearch && s.not(n.map(e => e[1])).ac("hidden_by_search"), n[t]
    }
    focus_node(e) {
        this.s.rc("active"), e.ac("active"), this.s = e, this._o.onHoverNode(e)
    }
    scrollTo(e) {
        let t = this.o.scrollTop(),
            o = e.position().top + t;
        (o > this.o.innerHeight() || t > o) && this.o.animate({
            scrollTop: o
        }, 0)
    }
    pos() {
        let e = this,
            t = e.target.offset(),
            o = t.top + e.target.outerHeight() + 10,
            s = window.innerHeight,
            n = e.o.height(),
            a = o + n > s ? o - Math.abs(s - o - n - 30) : o,
            i = t.left;
        e.o.css({
            display: "flex",
            top: s - t.top - n < 0 ? o : a,
            left: i,
            width: e.target.outerWidth()
        }), e.scrollTo(e.s)
    }
    change(e) {
        let t = this,
            o = $(e.target);
        t.value = o.attr("value") || o.text(), t.change_to(o.html()), t._o.onChange({
            target: o,
            originalEvent: e,
            value: t.value
        }), t.toggle(e)
    }
    change_to(e) {
        this.target.find(".value_inner").html(e)
    }
    toggle(e) {
        let t = this,
            o = e.target;
        t.open ? (t.o.hide(), t.target.rc("isOpen").ac("isClosed"), t._o.onClose(o)) : (t.pos(), t.target.rc("isClosed").ac("isOpen"), t._o.onOpen(o)), t.open = !t.open
    }
}
