# adapt-article-reveal

**Article Reveal** is an *extension* for the [Adapt framework](https://github.com/adaptlearning/adapt_framework).   

This extension hides the article inner and prepends an element containing a button to the top of the article element. Selecting the button reveals the hidden article inner.  

## Installation

This extension must be manually installed.  

If **Article Reveal** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).  

## Settings Overview

**Article Reveal** is configured at article (*articles.json*) level.  

The attributes listed below are properly formatted as JSON in [*example.json*](https://github.com/deltanet/adapt-article-reveal/blob/master/example.json).  

### Attributes

The Article Reveal attribute group contains values for **_isEnabled**, **_classes**, **_minHeight**, **displayTitle**, **bodyOpen**, **bodyClose**, **instructionOpen**, **instructionClose**, **buttonOpen**, **buttonClose**, **_ariaLabels**, and **_backgroundImage**.  

>**_isEnabled** (boolean):  Turns on and off the **Article Reveal** extension.  

>**_classes** (string): CSS class name to be applied to **Article Reveal**’s containing div. The class must be predefined in one of the Less files.  

>**_minHeight** (number): This specifies the minimum height for the Article.  

>**displayTitle** (string): This text becomes the Article display title.  

>**bodyOpen** (string): This text becomes the Article body text before the Article has been revealed.  

>**bodyClose** (string): This text becomes the Article body text once the Article is revealed.  

>**instructionOpen** (string): This text becomes the Article instruction text before the Article has been revealed.  

>**instructionClose** (string): This text becomes the Article instruction text once the Article is revealed.  

>**buttonOpen** (string): Defines the text on the button to reveal the Article.  

>**buttonClose** (string): Defines the text on the button to close the Article.  

>**_ariaLabels** (object): This object group contains the accessibility elements. It contains values for **openArticle**, and **closeArticle**.  

>>**openArticle** (string): This text becomes the **buttonOpen** Aria Label.  

>>**closeArticle** (string): This text becomes the **buttonClose** Aria Label.  

### Accessibility
Several elements of **Article Reveal** have been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **Article Reveal**. These labels are not visible elements. They are utilized by assistive technology such as screen readers.   

## Limitations

No known limitations.

----------------------------
**Version number:**  3.0.0   
**Framework versions supported:**  4+    
**Author / maintainer:** [C&G Kineo](https://github.com/cgkineo/adapt-article-reveal) / DeltaNet with [contributors](https://github.com/deltanet/adapt-article-reveal/graphs/contributors)     
**Accessibility support:** Yes  
**RTL support:** Yes     
**Authoring tool support:** Yes
