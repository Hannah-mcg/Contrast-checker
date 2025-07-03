var colInputs = document.getElementById("colourInputs");
var results = document.getElementById("result");

function addColour()
{
    var col = document.createElement("input");
    col.type = "color";
    colInputs.append(col);

    let i = colInputs.getElementsByTagName('input').length - 1;
    if (i + 1 > 2)
    {
        document.getElementById("removeCol").disabled = false;
    }
    else
    {
        document.getElementById("removeCol").disabled = true;
    }
}

function checkContrast()
{
    results.innerHTML = "";
    document.getElementById("showCols").classList.remove("hidden");
    var inputs = colInputs.getElementsByTagName("input");
    var palette = [];
    var contrast = [];
    for (let i = 0; i < inputs.length; i++)
    {
        palette.push(hexToRGB(inputs[i].value));
    }

    palette.forEach(a => 
    {
        var L1 = luminance(a['r'], a['g'], a['b']);
        palette.forEach(b =>
        {
            var L2 = luminance(b['r'], b['g'], b['b']);
            if (a != b)
            {
                contrast.push({
                    a: RGBToHex(a['r'], a['g'], a['b']),
                    b: RGBToHex(b['r'], b['g'], b['b']),
                    c: (L1 > L2 ? (L1 + 0.05) / (L2 + 0.05) : (L2 + 0.05) / (L1 + 0.05)).toFixed(2),
                    res: guidelines(L1 > L2 ? (L1 + 0.05) / (L2 + 0.05) : (L2 + 0.05) / (L1 + 0.05))
                });
            }
        })
    });

    contrast.forEach(r =>
    {
        var span = document.createElement("span");
        span.style.display = "flex";
        span.style.flexDirection = "column";
        span.style.gap = "5px";
        span.id = r['c'];

        var eg = document.createElement("span");
        eg.style.background = r['a'];
        eg.style.color = r['b'];
        eg.style.padding = "3px";
        eg.style.fontFamily = "'Fanwood Text', serif";
        eg.innerHTML = `Text colour: ${r['b']} on Background colour: ${r['a']} <br> <span>Small text</span> <br> <span class="large">Large text</span>`;
        span.append(eg);

        var con = document.createElement("span");
        con.innerHTML = `contrast: ${r['c']}`;
        span.append(con);

        var res = document.createElement("span");
        res.innerHTML = `WCAG guidelines <span class="arrow">&#9013</span>`;
        res.classList.add("toggle");
        res.addEventListener("click", (e) =>
        {
            res.nextElementSibling.classList.toggle("hidden");
        })
        span.append(res);

        var text = document.createElement("span");
        text.innerHTML = `AA-level large text: ${r['res']['AAL']} <br> 
                        AA-level small text: ${r['res']['AAS']} <br> 
                        AAA-level large text: ${r['res']['AAAL']} <br> 
                        AAA-level small text: ${r['res']['AAAS']}`;
        text.style.fontFamily = "'Maitree', serif";
        text.classList.add("WCAG");
        text.classList.add("hidden");
        span.append(text);
        results.append(span);
    })
}

function showCompCols()
{
    var colours = results.getElementsByTagName("span");
    for (let i = 0; i < colours.length; i++)
    {
        if (colours[i].id != '' && Number(colours[i].id) < 4.5)
        {
            colours[i].classList.toggle("hidden");
        }
    }

    if (document.getElementById("showCols").innerHTML.includes("compliant"))
    {
        document.getElementById("showCols").innerHTML = "Show all colours";
    }
    else
    {
        document.getElementById("showCols").innerHTML = "Show compliant colours";
    }
}

function hexToRGB(hex)
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function RGBToHex(r, g, b)
{
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function luminance(r, g, b)
{
    var c = [r, g, b].map(function(v)
    {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}

function guidelines(ratio)
{
    return {
        AAL: ratio > 3 ? 'Pass ✅' : 'Fail ❌',
        AAS: ratio > 4.5 ? 'Pass ✅' : 'Fail ❌',
        AAAL: ratio > 4.5 ? 'Pass ✅' : 'Fail ❌',
        AAAS: ratio > 7 ? 'Pass ✅' : 'Fail ❌'
    }
}

window.onscroll = function() { myFunction() };

var header = document.getElementById("heading");

var sticky = header.offsetTop;

function myFunction()
{
    if (window.scrollY > sticky)
    {
        header.classList.add("sticky");
    } else
    {
        header.classList.remove("sticky");
    }
}

function removeColour()
{
    let i = colInputs.getElementsByTagName('input').length - 1;
    if (i + 1 > 2)
    {
        colInputs.removeChild(colInputs.getElementsByTagName("input")[i]);
        i--;

        if (i + 1 <= 2)
        {
            document.getElementById("removeCol").disabled = true;
        }
        else
        {
            document.getElementById("removeCol").disabled = false;
        }
    }
}