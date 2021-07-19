class selector {
    constructor(opts) {
        let _self = this;
        _self.opts = Object.assign({
            onHoverNode: function (e) {},
            onOpen: function (e) {},
            onClose: function (e) {},
            onChange: function (e) {},
            onToggleGroup: function (e) {},
            enableSearch: false,
            renewSearch: true,
            caseSensitive: false,
            matchingFunction: function (match, search) {
                var check_case = (x) => _self.caseSensitive ? x : x.toLowerCase();
                return check_case(match.substring(0, search.length)) == check_case(search)
            },
            target: "",
            shorthandDescriptors: {
                option: "opt",
                group: "group",
                value: "v"
            }
        }, opts);
        let o_tag = _self.opts.shorthandDescriptors.option,
            g_tag = _self.opts.shorthandDescriptors.group;

        _self.session = Math.random().toString(36).substring(2, 15);
        _self.target = opts.target
        // Append the actual opener to the body.
        _self.opener = $(`<div class='custom_select_details' data-opener-for='${_self.session}'>${_self.target.html()}</div>`);
        _self.opener.find(g_tag).on("click", function (e) {
            if($(e.target).is(g_tag)) {
                $(this).toggleClass("is_closed");
                _self.opts.onToggleGroup({target: this, wasClosed: $(this).is(".is_closed")})
            };
        })
        $(document.body).append(_self.opener)
        // Remove left over values from the select
        _self.target.prop("id", _self.session).on("click", function (e) {
            _self.toggle(e);
        }).find("*").remove().addBack().append(`<div class='value_inner' data-selector-for="${_self.session}"></div>`)
        _self.is_open = false;
        _self.selected = _self.opener.find(`${_self.opener.find("[selected]").length == 0 ? o_tag : "[selected]"}`).eq(0).addClass("active");
        _self.value = _self.selected.attr("value") || _self.selected.text();
        _self.change_to(_self.selected.html())
        _self.all = _self.opener.find(`${o_tag}:not([disabled])`);

        _self.all.on("click", function (e) {
            _self.change(e)
        }).on("mouseenter", function (e) {
            _self.focus_node($(e.target))
        })
        _self.last_key_search = ["", 0, _self.selected];
        $(document.body).on("keydown", function (e) {
            if (_self.is_open) {
                let find = `${o_tag}:visible:not([disabled])`,
                    k = e.key;
                if (k == "ArrowDown") {
                    let next = _self.selected.nextAll(find).eq(0),
                        n = next.length == 0 ? _self.opener.find(`${o_tag}:first-of-type`) : next;
                    _self.focus_node(n)
                    _self.scrollTo(n)
                } else if (k == "ArrowUp") {
                    let prev = _self.selected.prevAll(find).eq(0),
                        p = prev.length == 0 ? _self.opener.find(`${o_tag}:last-of-type`) : prev;
                    _self.focus_node(p)
                    _self.scrollTo(p)
                } else if (k == "Enter") {
                    _self.change({
                        target: _self.selected
                    })
                } else if (k.length == 1 || k == "Backspace") {
                    let _l = _self.last_key_search;
                    _l[1] = _l[0] == k ? _l[2] == _self.selected ? _l[1] + 1 : 0 : 0
                    _l[0] = _self.opts.renewSearch ? k : k == "Backspace" ? _l[0].substr(0, _l[0].length - 1) : _l[0] + k;
                    !_self.opts.renewSearch ? $(`.value_inner[data-selector-for="${_self.session}"]`).attr("data-search-term", _l[0]) : "";
                    let found = _self.find(_l[0], _l[1]);
                    if (found && found[1]) {
                        _self.scrollTo($(found[1]))
                        _self.focus_node($(found[1]))
                        _l[2] = _self.selected
                    } else if (_self.opts.renewSearch) {
                        _l[0] = "";
                    }
                } else if (k == "Escape") {
                    _self.toggle({
                        target: _self.selected
                    })
                }
            }
        })
    }

    find(key, offset = 0) {
        let all = this.opener.find(this.opts.shorthandDescriptors.option),
            json = Object.values(all).map(x => [x.innerText, x]).filter(a => a[0] && this.opts.matchingFunction(a[0], key))
        all.removeClass("hidden_by_search");
        this.opts.renewSearch == false ? all.not(json.map(x => x[1])).addClass("hidden_by_search") : "";
        return json[offset];
    }

    focus_node(e) {
        this.selected.removeClass("active");
        e.addClass("active")
        this.selected = e;
        this.opts.onHoverNode(e)
    }

    scrollTo(node) {
        let st = this.opener.scrollTop(),
            pos = node.position().top + st;
        if (pos > this.opener.innerHeight() || st > pos) {
            this.opener.animate({
                scrollTop: pos
            }, 0)
        }
    }

    position_on() {
        let offset = this.target.offset(),
            pos_under = offset.top + this.target.outerHeight() + 10,
            wi = window.innerHeight,
            top = pos_under + this.opener.height() > wi ? pos_under - Math.abs((wi - pos_under - this.opener.height() - 30)) : pos_under,
            left = offset.left;
        this.opener.css({
            display: 'flex',
            top: wi - offset.top - this.opener.height() < 0 ? pos_under : top,
            left: left
        })
        this.scrollTo(this.selected)
    }

    change(e) {
        e.target = $(e.target)
        this.value = e.target.attr("value") || e.target.text()
        this.change_to(e.target.html());
        this.opts.onChange({
            node: e.target,
            event: e,
            value: this.value
        })
        this.toggle(e)
    }

    change_to(x) {
        this.target.find(".value_inner").html(x)
    }

    toggle(e) {
        let _self = this;
        if (_self.is_open) {
            _self.opener.hide();
            _self.target.removeClass("isOpen").addClass("isClosed")
            _self.opts.onClose(e.target);
        } else {
            _self.position_on()
            _self.target.removeClass("isClosed").addClass("isOpen")
            _self.opts.onOpen(e.target);
        }
        _self.is_open = !_self.is_open;

    }
}
let minilect = new selector({
    target: $('.custom_select'),
    renewSearch: false,
    enableSearch: true
})
