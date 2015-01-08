/**********************************************************************************************************************************************/
/*  ACCEPT PROJECT - http://www.accept.unige.ch/index.html or http://cordis.europa.eu/fp7/ict/language-technologies/project-accept_en.html    */
/*  Evaluation Plug-in (version 1.0)                                                                                                         */
/*  David Silva - davidluzsilva@gmail.com                                                                                                     */
/*                                                                                                                                            */
/**********************************************************************************************************************************************/

(function ($) {

    var globalEvalChunks = [];
    var currentChunkIndex = 0;
    var k = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=";

    $.fn.AcceptEvaluation = function (options) {

        var $evaluationContainer = $(this);

        var settings = $.extend({
            'acceptApiUrl': 'http://www.accept-portal.com/AcceptApi',
            'evaluationApiKey': '3f0faf2eed5441ac974a5159f276fa6b',
            'evaluationLanguage': 'en_us',
            'projectId': '9',
            'questionId': '9',
            'questionPath': '/api/v1/Evaluation/ContentChunks/9?key=3f0faf2eed5441ac974a5159f276fa6b&language=de_de&question=10'
        }, options);

        //private methods.
        function buildParagraph() {
            debugger;
            currentChunkIndex = $.localStorage.plugin.getItem("acceptEvaluationChunkData");
            if (currentChunkIndex == undefined)
                currentChunkIndex = 0;

            if (globalEvalChunks[currentChunkIndex] != undefined)
                $("#chunk_").text(globalEvalChunks[currentChunkIndex].Chunk);
        }

        //refresh paragraph.
        function rebuildParagraph() {
            currentChunkIndex = currentChunkIndex + 1;
            if (currentChunkIndex > (globalEvalChunks.length - 1))
                currentChunkIndex = 0;

            $.localStorage.plugin.setItem("acceptEvaluationChunkData", currentChunkIndex);
            if (globalEvalChunks[currentChunkIndex] != undefined)
                $("#chunk_").text(globalEvalChunks[currentChunkIndex].Chunk);
        }

        //get evalutation question.
        function getQuestion(containerCssSelector) {
            $.ajax({
                url: settings.acceptApiUrl + '/api/v1/Evaluation/ContentChunks/' + settings.projectId + '?key=' + settings.questionId + '&language=' + settings.evaluationLanguage + '&question=' + settings.questionId + '',
                contentType: "application/json",
                type: "GET",
                async: false,
                cache: false,
                dataType: 'jsonp',
                success: function (data) {

                    var text = '';
                    var q = data.ResponseObject.questionList[0];
                    globalEvalChunks = data.ResponseObject.chunkList;

                    for (var i = 0; i < q.LanguageQuestions.length; i++) {
                        question = q.LanguageQuestions[i].Question;
                        questionId = q.LanguageQuestions[i].Id;
                        language = q.LanguageQuestions[i].Language.Code;
                        languageid = q.LanguageQuestions[i].Language.Id
                        action = q.LanguageQuestions[i].Action;
                        
                        $(containerCssSelector).each(function () {

                            var id = $(this).attr("id");
                            var PostID = "0";
                            var frmName = "voting_" + PostID;
                            text = '<form id="' + frmName + '"><table border=1><tr><td bgcolor=lightgray><b>' + question + '</b></td></tr>';
                            text += '<tr><td><p id="loadingPar_" style="width: 100%;height: inherit;text-align: center;padding-top: 30px;padding-bottom: 20px;display:none;"><img alt="" src="http://www.accept-portal.eu/Plugin/images/ajax-loader.gif"></p><p id="chunk_" align="justify"></p><div id="voteoptions">';

                            for (var x = 0; x < q.LanguageQuestions[i].Answers.length; x++) {
                                answer = q.LanguageQuestions[i].Answers[x];
                                if (x == 0) {
                                    text += '<input id="radioCount_' + answer.Id + '" type="radio" name="choice" value="' + answer.Id + '" checked>' + answer.Name + "&nbsp;&nbsp;&nbsp;";
                                    text += '<br />';
                                }
                                else {
                                    text += '<input id="radioCount_' + answer.Id + '" type="radio" name="choice" value="' + answer.Id + '">' + answer.Name + "&nbsp;&nbsp;&nbsp;";
                                    text += '<br />';
                                }
                            }

                            text += '<br/>';
                            text += '<input  style="width: 100px; font-weight:bold; color:#D84704; background-color:#F5DDCC; border-color:#F5DDCC; font-size:12px; line-height:20px; display:inline; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;" value="' + action + '" type="button" onclick="$.submitVote(\'' + frmName + '\');" />';
                            text += '<span id="spnThankyou_" style="padding-left:10px;display:none;color:Green;">Danke!</span></div>';
                            text += '<div id="voteresult" style="display:none">';
                            text += '<font color="green">' + q.LanguageQuestions[i].Confirmation + '</font>';
                            text += '</div>';
                            text += '</td></tr>';
                            text += '</table></form>';
                           
                            $(this).html(text);
                            buildParagraph();
                            $("#voteoptions").find("input").attr("checked", false);
                        });
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) { }
            });


        }

        //decode base 64 string.	
        function d64(t) {
            var out = "";
            var c1, c2, c3 = "";
            var e1, e2, e3, e4 = "";
            var i = 0;
            t = t.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do {
                e1 = k.indexOf(t.charAt(i++));
                e2 = k.indexOf(t.charAt(i++));
                e3 = k.indexOf(t.charAt(i++));
                e4 = k.indexOf(t.charAt(i++));

                c1 = (e1 << 2) | (e2 >> 4);
                c2 = ((e2 & 15) << 4) | (e3 >> 2);
                c3 = ((e3 & 3) << 6) | e4;

                out = out + String.fromCharCode(c1);

                if (e3 != 64) {
                    out = out + String.fromCharCode(c2);
                }
                if (e4 != 64) {
                    out = out + String.fromCharCode(c3);
                }

                c1 = c2 = c3 = "";
                e1 = e2 = e3 = e4 = "";

            } while (i < t.length);

            return unescape(out);
        }

        //submit vote
        $.submitVote = function (frmName) {

            debugger;

            var PostID = frmName.replace("voting_", "");
            var $msg = $("div[class^='lia-message-view message-uid-" + PostID + "']");
            $('#' + frmName + " input:radio").each(function () {
                if ($(this).is(':checked')) {
                    $('#Ehdd2').val($(this).val());
                    $('#Ehdd3').val(encodeURIComponent($("#chunk_").text()));
                    $('#Ehdd4').val($msg.find(".local-date:first").text());
                    $('#Ehdd5').val("{IP}");
                    $('#Ehdd6').val($("#viewUserProfile").text());

                    //remove tem iframe.
                    $('#tempIframeEvalProject').remove();

                    //re-create iframe to handle the form target.
                    var iframe = document.createElement('iframe');
                    iframe.style.display = "none";
                    iframe.name = 'hiddenEvaluationPortalIFrame';
                    iframe.id = 'tempIframeEvalProject';
                    document.body.appendChild(iframe);

                    var f = $("#EvaluationProjectsForm");

                    if (f != null) {
                        f.submit();

                        $("#chunk_").css("display", "none");
                        $("#loadingPar_").css("display", "block");
                        $("#spnThankyou_").css("display", "inline");

                        setTimeout(function () {
                            rebuildParagraph();
                            $("#loadingPar_").css("display", "none");
                            $("#spnThankyou_").css("display", "none");
                            $("#chunk_").css("display", "block");
                            $("#voteoptions").find("input").attr("checked", false);

                        }, 1000);

                    }
                }
            });
        }

        function init() {
            debugger;
            $(document.body).append('<div style="display:none">'+ 
                '<form  id="EvaluationProjectsForm"  method="post" action="' + settings.acceptApiUrl + '/Api/v1/Evaluation/ScoreFormPost" target="hiddenEvaluationPortalIFrame">' +
                '<input type="hidden" id="Ehdd0" name="Id" value="'+settings.projectId+'" />'+
                '<input type="hidden" id="Ehdd1" name="key" value="'+settings.evaluationApiKey+'" />'+
                '<input type="hidden" id="Ehdd2" name="answer" value="" />'+
                '<input type="hidden" id="Ehdd3" name="param1" value="" />'+
                '<input type="hidden" id="Ehdd4" name="param2"  value="" />'+ 
                '<input type="hidden" id="Ehdd5" name="param3" value="" />'+
                '<input type="hidden" id="Ehdd6" name="param4" value="" />'+
                '<input type="hidden" id="Ehdd7" name="param5" value="" />'+  
                '<input type="hidden" id="Ehdd8" name="param6" value="" />'+ 
                '<input type="hidden" id="Ehdd9" name="param7" value="" />'+ 
                '<input type="hidden" id="Ehdd10" name="param8" value="" />'+ 
                '<input type="hidden" id="Ehdd11" name="param9" value="" />'+ 
                '<input type="hidden" id="Ehdd12" name="param10" value="" />'+ 
                '</form>'+
                '</div>');


            getQuestion($evaluationContainer);

        }

        init();

    }

})(jQuery);

//dependencies - accept local storage.
(function ($, document, undefined) {
    var supported;
    try {
        supported = typeof window.localStorage == 'undefined' || typeof window.JSON == 'undefined' ? false : true;
    } catch (error) { }

    $.localStorage = function (key, value, options) {
        options = jQuery.extend({}, options);
        return $.localStorage.plugin.init(key, value);
    }

    $.localStorage.setItem = function (key, value) {
        return $.localStorage.plugin.setItem(key, value);
    }

    $.localStorage.getItem = function (key) {
        return $.localStorage.plugin.getItem(key);
    }

    $.localStorage.removeItem = function (key) {
        return $.localStorage.plugin.removeItem(key);
    }

    $.localStorage.plugin = {
        init: function (key, value) {
            if (typeof value != 'undefined') {
                return this.setItem(key, value);
            } else {
                return this.setItem(key);
            }
        },
        setItem: function (key, value) {
            var value = JSON.stringify(value);
            if (!supported) {
                try {
                    $.localStorage.cookie(key, value);
                } catch (e) { }
            }
            window.localStorage.setItem(key, value);
            return this.result(value);
        },
        getItem: function (key) {
            if (!supported) {
                try {
                    return this.result($.localStorage.cookie(key));
                } catch (e) {
                    return null;
                }
            }
            return this.result(window.localStorage.getItem(key));
        },
        removeItem: function (key) {
            if (!supported) {
                try {
                    $.localStorage.cookie(key, null);
                    return true;
                } catch (e) {
                    return false;
                }
            }
            window.localStorage.removeItem(key);
            return true;
        },
        result: function (res) {
            var ret;
            try {
                ret = JSON.parse(res);
                if (ret == 'true') {
                    ret = true;
                }
                if (ret == 'false') {
                    ret = false;
                }
                if (parseFloat(ret) == ret && typeof ret != "object") {
                    ret = parseFloat(ret);
                }
            } catch (e) { }
            return ret;
        }
    }

    $.localStorage.cookie = function (key, value, options) {

        if (arguments.length > 1 && (value === null || typeof value !== "object")) {
            if (value === null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            return (document.cookie = [
				encodeURIComponent(key), '=',
				options.raw ? String(value) : encodeURIComponent(String(value)),
				options.expires ? '; expires=' + options.expires.toUTCString() : '',
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
            ].join(''));
        }

        options = value || {};
        var result,
			decode = options.raw ? function (s) { return s; } : decodeURIComponent;

        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    }

})(jQuery, document);