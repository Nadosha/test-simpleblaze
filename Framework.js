function Binding(b) {
    /*
     This function allows to create custom
     getters and setters for an object, or even replace them for existing properties
     */
    let self = this;
    this.elementBindings = [];
    this.value = b.object.data[b.property];

    this.valueGetter = function(){
        return self.value;
    };

    this.valueSetter = function(val){
        self.value = val;
        for (let i = 0; i < self.elementBindings.length; i++) {
            let binding=self.elementBindings[i];
            binding.element[binding.attribute] = val;
        }
    };

    this.addBinding = function(element, attribute, event){
        let binding = {
            element: element,
            attribute: attribute
        };

        if (event){
            // To get DOM feedback, the binding needs an event to listen for
            // I have implemented this by forwarding props
            element.addEventListener(event, function(){
                let valueOnEvent = event !== "click" ? element[attribute] : "";
                self.valueSetter(valueOnEvent);
            });
            binding.event = event
        }

        this.elementBindings.push(binding);

        element[attribute] = self.value;
        return self
    };

    Object.defineProperty(b.object.data, b.property, {
        get: this.valueGetter,
        set: this.valueSetter
    });
    b.object.data[b.property] = this.value;
}

const Framework = {
    create : function(props) {
        let self = this;
        this.bind = new Binding({
            object: props,
            property: "title"
        });
       return {
            render(node) {
                document.addEventListener('DOMContentLoaded', function() {
                    //Rendering of template
                    let content = document.querySelector(node);
                    let template = document.getElementById(props.template.replace(/#/, '')).innerHTML;

                    //Match all tags for replacement
                    let replaceArray = template.match(/{{([^}]*[^{]*)}}/g).map(function(s) {
                        return s.substring(2, s.length - 2)
                    }).filter((v, i, a) => a.indexOf(v) === i);

                    let replaceWith = [];
                    //Collect from props data
                    for(let o in props.data) {
                        replaceWith.push(props.data[o]);
                    }

                    for(let i = 0; i < replaceArray.length; i++) {
                        /*
                            Replace all tags with props data
                            So, you can use it like Blaze or Vue now!
                            {{key}} - prop.data[key]
                         */
                        template = template.replace(new RegExp('{{' + replaceArray[i] + '}}', 'gi'), replaceWith[i]);
                    }

                    content.innerHTML = template;

                    //Binding
                    let elements = document.querySelectorAll('[data-event]');
                    for(let key in elements) if (elements.hasOwnProperty(key)){
                        let element = elements[key].getAttribute('data-event');
                        let eventType = /(.+):/.exec(element)[1];

                        self.bind.addBinding(elements[key], "value", eventType);

                    }

                    //Replace titleChanged in case of binding functionality
                    let title = document.querySelector('h1');
                    self.bind.addBinding(title, "innerHTML");

                    return true; //For check if rendered
                });
            }
       }
    }
};

