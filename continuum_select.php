<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/dist/style/select.css">
    <script src="/Javascript/jquery-3.6.0.min.js"></script>
    <title>Select</title>
</head>
<body>
    <div class="custom_select">
        <group>This is the first group....</group>
        <opt value="first"><a href="">First Item</a></opt>
        <opt value="first">Second Item</opt>
        <opt value="first">Third Item</opt>
        <opt value="first">Fourth Item</opt>
        <opt value="first">First Item</opt>
        <opt value="first">Second Item</opt>
        <opt value="first" disabled>Third Item</opt>
        <opt value="first" disabled>Fourth Item</opt>
        <opt value="first" disabled>First Item</opt>
        <opt value="first" disabled>Second Item</opt>
        <opt value="first" disabled>Third Item</opt>
        <opt value="first">Fourth Item</opt>
        <opt value="first">First Item</opt>
        <group>This is the second group....</group>
        <opt value="first">Second Item</opt>
        <opt value="first">Third Item</opt>
        <opt value="first">Fourth Item</opt>
        <opt value="first">First Item</opt>
        <opt value="first" selected>Second Item</opt>
        <opt value="first">Third Item</opt>
        <opt value="first">Fourth Item</opt>
        <opt value="first">First Item</opt>
        <opt value="first">Second Item</opt>
        <opt value="first">Third Item</opt>
        <opt value="first">Fourth Item</opt>
        <opt value="first">First Item</opt>
        <opt value="first">Second Item</opt>
        <opt value="first">Third Item</opt>
        <opt value="first">Fourth Item</opt>
        <opt value="first">First Item</opt>
        <opt value="first">Second Item</opt>
        <opt value="first">Third Item</opt>
        <group>Some last group</group>
    </div>
</body>
</html>

<script>
    class selector {
        constructor(opts) {
            let _self = this;
            this.opts = Object.assign({
                onHoverNode: function(e) {},
                onOpen: function(e) {},
                onClose: function(e) {},
                onChange: function(e) {},
                enableSearch: false,
                renewSearch: true,
                caseSensitive: false,
                matchingFunction: function(match, search) {
                    var check_case = (x) => this.caseSensitive ? x : x.toLowerCase();
                    return check_case(match.substring(0, search.length)) == check_case(search)
                },
                target: "",
                shorthandDescriptors: {option: "opt", group: "group", value: "v"}
            }, opts);
            let o_tag = this.opts.shorthandDescriptors.option;

            this.session = Math.random().toString(36).substring(2, 15);
            this.target = opts.target
            // Append the actual opener to the body.
            this.opener = $(`<div class='custom_select_details' data-opener-for='${this.session}'>${this.target.html()}</div>`);
            $(document.body).append(this.opener)
            // Remove left over values from the select
            this.target.prop("id", this.session).on("click", function(e) {
                _self.toggle(e);
            }).find("*").remove().addBack().append(`<div class='value_inner' data-selector-for="${this.session}"></div>`)
            this.is_open = false;
            this.selected = this.opener.find(`${this.opener.find("[selected]").length == 0 ? o_tag : "[selected]"}`).eq(0).addClass("active");
            this.value = this.selected.attr("value") || this.selected.text();
            this.change_to(this.selected.html())
            this.all = this.opener.find(`${o_tag}:not([disabled])`);
            
            this.all.on("click", function(e) {
                _self.change(e)
            }).on("mouseenter", function(e) {
                _self.focus_node($(e.target))
            })
            this.last_key_search = ["", 0, this.selected];
            $(document.body).on("keydown", function(e) {
                if (_self.is_open) {
                    let find = `${o_tag}:visible:not([disabled])`;
                    if (e.key == "ArrowDown") {
                        let next = _self.selected.nextAll(find).eq(0),
                            n = next.length == 0 ? _self.opener.find(`${o_tag}:first-of-type`) : next;
                        _self.focus_node(n)
                        _self.scrollTo(n)
                    } else if (e.key == "ArrowUp") {
                        let prev = _self.selected.prevAll(find).eq(0),
                            p = prev.length == 0 ? _self.opener.find(`${o_tag}:last-of-type`) : prev;
                        _self.focus_node(p)
                        _self.scrollTo(p)
                    } else if (e.key == "Enter") {
                        _self.change({target: _self.selected})
                    } else if ((e.key.length == 1 || e.key == "Backspace") && _self.opts.enableSearch) {
                        let _l = _self.last_key_search;
                        _l[1] = _l[0] == e.key ? _l[2] == _self.selected ? _l[1] + 1 : 0 : 0
                        _l[0] = _self.opts.renewSearch ? e.key : e.key == "Backspace" ? _l[0].substr(0, _l[0].length - 1) :_l[0] + e.key;
                        !_self.opts.renewSearch ? $(`.value_inner[data-selector-for="${_self.session}"]`).attr("data-search-term", _l[0]) : "";
                        let found = _self.find(_l[0], _l[1]);
                        if (found && found[1]) {
                            _self.scrollTo($(found[1])) 
                            _self.focus_node($(found[1]))
                            _l[2] = _self.selected
                        } else if (_self.opts.renewSearch) {
                            _l[0] = "";  
                        }
                    } else if (e.key == "Escape") {
                        _self.toggle({target: _self.selected})
                    }
                }
            })
        }

        find(key, offset = 0) {
            let all = this.opener.find(this.opts.shorthandDescriptors.option),
                json = Object.values(all).map(x => [x.innerText, x]).filter(a => a[0] && this.opts.matchingFunction(a[0], key))
            all.show()
            this.opts.renewSearch == false ? all.not(json.map(x => x[1])).hide() : "";
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
                this.opener.animate({scrollTop: pos}, 100)
            }
        }

        position_on() {
            let offset = this.target.offset(),
                pos_under = offset.top + this.target.outerHeight() + 10,
                wi = window.innerHeight,
                top = pos_under + this.opener.height() > wi ? pos_under - Math.abs((wi - pos_under - this.opener.height() - 30)) : pos_under,
                left = offset.left;
            this.opener.css({display: 'flex', top: wi - offset.top - this.opener.height() < 0 ? pos_under : top, left: left})
            this.scrollTo(this.selected)
        }

        change(e) {
            e.target = $(e.target)
            this.value = e.target.attr("value") || e.target.text()
            this.change_to(e.target.html());
            this.opts.onChange({node: e.target, event: e, value: this.value})
            this.toggle(e)
        }

        change_to(x) {
            this.target.find(".value_inner").html(x)
        }

        toggle(e) {
            if (this.is_open) {
                this.opener.hide();
                this.target.removeClass("isOpen").addClass("isClosed")
                this.opts.onClose(e.target);
            } else {
                this.position_on()
                this.target.removeClass("isClosed").addClass("isOpen")
                this.opts.onOpen(e.target); 
            }
            this.is_open = !this.is_open;
            
        }
    }
    let elect = new selector({target: $('.custom_select'), renewSearch: false, onChange: function(e) {console.log(e)}})
</script>