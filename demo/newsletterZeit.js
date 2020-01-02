export default `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <!-- NAME: SIMPLE TEXT -->
        <!--[if gte mso 15]>
        <xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Node.js 8 – End-Of-Life</title>

    <style type="text/css">
		p{
			margin:10px 0;
			padding:0;
		}
		table{
			border-collapse:collapse;
		}
		h1,h2,h3,h4,h5,h6{
			display:block;
			margin:0;
			padding:0;
		}
		img,a img{
			border:0;
			height:auto;
			outline:none;
			text-decoration:none;
		}
		body,#bodyTable,#bodyCell{
			height:100%;
			margin:0;
			padding:0;
			width:100%;
		}
		.mcnPreviewText{
			display:none !important;
		}
		#outlook a{
			padding:0;
		}
		img{
			-ms-interpolation-mode:bicubic;
		}
		table{
			mso-table-lspace:0pt;
			mso-table-rspace:0pt;
		}
		.ReadMsgBody{
			width:100%;
		}
		.ExternalClass{
			width:100%;
		}
		p,a,li,td,blockquote{
			mso-line-height-rule:exactly;
		}
		a[href^=tel],a[href^=sms]{
			color:inherit;
			cursor:default;
			text-decoration:none;
		}
		p,a,li,td,body,table,blockquote{
			-ms-text-size-adjust:100%;
			-webkit-text-size-adjust:100%;
		}
		.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
			line-height:100%;
		}
		a[x-apple-data-detectors]{
			color:inherit !important;
			text-decoration:none !important;
			font-size:inherit !important;
			font-family:inherit !important;
			font-weight:inherit !important;
			line-height:inherit !important;
		}
		#bodyCell{
			padding:10px;
		}
		.templateContainer{
			max-width:600px !important;
		}
		a.mcnButton{
			display:block;
		}
		.mcnImage,.mcnRetinaImage{
			vertical-align:bottom;
		}
		.mcnTextContent{
			word-break:break-word;
		}
		.mcnTextContent img{
			height:auto !important;
		}
		.mcnDividerBlock{
			table-layout:fixed !important;
		}
		body,#bodyTable{
			background-color:#ffffff;
			background-image:none;
			background-repeat:no-repeat;
			background-position:center;
			background-size:cover;
		}
		#bodyCell{
			border-top:0;
		}
		.templateContainer{
			border:0;
		}
		h1{
			color:#202020;
			font-family:Helvetica;
			font-size:26px;
			font-style:normal;
			font-weight:bold;
			line-height:125%;
			letter-spacing:normal;
			text-align:left;
		}
		h2{
			color:#202020;
			font-family:Helvetica;
			font-size:22px;
			font-style:normal;
			font-weight:bold;
			line-height:125%;
			letter-spacing:normal;
			text-align:left;
		}
		h3{
			color:#202020;
			font-family:Helvetica;
			font-size:20px;
			font-style:normal;
			font-weight:bold;
			line-height:125%;
			letter-spacing:normal;
			text-align:left;
		}
		h4{
			color:#202020;
			font-family:Helvetica;
			font-size:18px;
			font-style:normal;
			font-weight:bold;
			line-height:125%;
			letter-spacing:normal;
			text-align:left;
		}
		#templateHeader{
			border-top:0;
			border-bottom:0;
		}
		#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{
			color:#202020;
			font-family:Helvetica;
			font-size:16px;
			line-height:150%;
			text-align:left;
		}
		#templateHeader .mcnTextContent a,#templateHeader .mcnTextContent p a{
			color:#007C89;
			font-weight:normal;
			text-decoration:underline;
		}
		#templateBody{
			border-top:0;
			border-bottom:0;
		}
		#templateBody .mcnTextContent,#templateBody .mcnTextContent p{
			color:#202020;
			font-family:Helvetica;
			font-size:16px;
			line-height:150%;
			text-align:left;
		}
		#templateBody .mcnTextContent a,#templateBody .mcnTextContent p a{
			color:#067df7;
			font-weight:normal;
			text-decoration:none;
		}
		#templateFooter{
			border-top:0;
			border-bottom:0;
		}
		#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{
			color:#202020;
			font-family:Helvetica;
			font-size:12px;
			line-height:150%;
			text-align:left;
		}
		#templateFooter .mcnTextContent a,#templateFooter .mcnTextContent p a{
			color:#202020;
			font-weight:normal;
			text-decoration:underline;
		}
	@media only screen and (min-width:768px){
		.templateContainer{
			width:600px !important;
		}

}	@media only screen and (max-width: 480px){
		body,table,td,p,a,li,blockquote{
			-webkit-text-size-adjust:none !important;
		}

}	@media only screen and (max-width: 480px){
		body{
			width:100% !important;
			min-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		#bodyCell{
			padding-top:10px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnRetinaImage{
			max-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImage{
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
			max-width:100% !important;
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnBoxedTextContentContainer{
			min-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupContent{
			padding:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
			padding-top:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
			padding-top:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardBottomImageContent{
			padding-bottom:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupBlockInner{
			padding-top:0 !important;
			padding-bottom:0 !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupBlockOuter{
			padding-top:9px !important;
			padding-bottom:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnTextContent,.mcnBoxedTextContentColumn{
			padding-right:18px !important;
			padding-left:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
			padding-right:18px !important;
			padding-bottom:0 !important;
			padding-left:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcpreview-image-uploader{
			display:none !important;
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		h1{
			font-size:22px !important;
			line-height:125% !important;
		}

}	@media only screen and (max-width: 480px){
		h2{
			font-size:20px !important;
			line-height:125% !important;
		}

}	@media only screen and (max-width: 480px){
		h3{
			font-size:18px !important;
			line-height:125% !important;
		}

}	@media only screen and (max-width: 480px){
		h4{
			font-size:16px !important;
			line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
		table.mcnBoxedTextContentContainer td.mcnTextContent,td.mcnBoxedTextContentContainer td.mcnTextContent p{
			font-size:14px !important;
			line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
		td#templateHeader td.mcnTextContent,td#templateHeader td.mcnTextContent p{
			font-size:16px !important;
			line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
		td#templateBody td.mcnTextContent,td#templateBody td.mcnTextContent p{
			font-size:16px !important;
			line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
		td#templateFooter td.mcnTextContent,td#templateFooter td.mcnTextContent p{
			font-size:14px !important;
			line-height:150% !important;
		}

}</style></head>
    <body style="background:#ffffff none no-repeat center/cover;height: 100%;padding: 0;width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #ffffff;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;">
        <!--
-->
        <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">Our upstream provider AWS is deprecating support for Node.js 8. As a result, you need to switch to a more recent Node.js version.</span><!--<![endif]-->
        <!--
-->
        <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background:#ffffff none no-repeat center/cover;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #ffffff;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;">
                <tr>
                    <td align="left" valign="top" id="bodyCell" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;padding-left: 0 !important;padding-right: 0 !important;">
                        <!-- BEGIN TEMPLATE // -->
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                        <tr>
                        <td align="center" valign="top" width="600" style="width:600px;">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;border: 0;max-width: 600px !important;">
                            <tr>
                                <td valign="top" id="templateHeader" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;border-top: 0;border-bottom: 0;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
    <tbody class="mcnImageBlockOuter">
            <tr>
                <td valign="top" style="padding: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" class="mcnImageBlockInner">
                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                        <tbody><tr>
                            <td class="mcnImageContent" valign="top" style="padding-right: 9px;padding-left: 9px;padding-top: 0;padding-bottom: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">

                                    <a href="https://zeit.us12.list-manage.com/track/click?u=3c9e9e13d7e6dae8faf375bed&id=fbf5042448&e=c9edb6a9f6" title="" class="" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                        <img align="left" alt="" src="https://gallery.mailchimp.com/3c9e9e13d7e6dae8faf375bed/images/d0280daa-f502-479f-885d-a16228c996f5.png" width="40" style="max-width: 80px;padding-bottom: 0;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnRetinaImage">
                                    </a>

                            </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
    </tbody>
</table></td>
                            </tr>
                            <tr>
                                <td valign="top" id="templateBody" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;border-top: 0;border-bottom: 0;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>

                        <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px;color: #000000;font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, Verdana, sans-serif;font-size: 14px;line-height: 150%;text-align: left;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;">

                            <br>
Hey there,<br>
<br>
I am writing to give notice that <strong>Node.js 8</strong> will reach its <strong>End-Of-Life</strong> on <strong>December 31, 2019,</strong> and will no longer be supported by <a href="https://zeit.us12.list-manage.com/track/click?u=3c9e9e13d7e6dae8faf375bed&id=62e3d7fde7&e=c9edb6a9f6" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #067df7;font-weight: normal;text-decoration: none;">ZEIT Now</a> starting <strong>January 6, 2020</strong> (<a href="https://zeit.us12.list-manage.com/track/click?u=3c9e9e13d7e6dae8faf375bed&id=9845df9a61&e=c9edb6a9f6" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #067df7;font-weight: normal;text-decoration: none;">enforced</a> by our upstream provider <a href="https://zeit.us12.list-manage.com/track/click?u=3c9e9e13d7e6dae8faf375bed&id=43d08558eb&e=c9edb6a9f6" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #067df7;font-weight: normal;text-decoration: none;">AWS Lambda</a>).<br>
<br>
You can find more details about the Node.js End-Of-Life Schedule <a href="https://zeit.us12.list-manage.com/track/click?u=3c9e9e13d7e6dae8faf375bed&id=2d516b0a6e&e=c9edb6a9f6" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #067df7;font-weight: normal;text-decoration: none;">here</a>.<br>
<br>
&nbsp;
<h3 style="display: block;margin: 0;padding: 0;color: #202020;font-family: Helvetica;font-size: 20px;font-style: normal;font-weight: bold;line-height: 125%;letter-spacing: normal;text-align: left;">What Does This Mean?</h3>
<br>
Starting on&nbsp;<strong>January 6, 2020</strong>, new deployments without <span style="color:#cc00ff; font-family:menlo,monaco,lucida console,liberation mono,dejavu sans mono,bitstream vera sans mono,courier new,monospace; font-size:14px"><code>engines</code></span> defined in&nbsp;<span style="color:#cc00ff; font-family:menlo,monaco,lucida console,liberation mono,dejavu sans mono,bitstream vera sans mono,courier new,monospace; font-size:14px"><code>package.json</code></span>&nbsp;will use the most recent (<a href="https://zeit.us12.list-manage.com/track/click?u=3c9e9e13d7e6dae8faf375bed&id=972783ffb3&e=c9edb6a9f6" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #067df7;font-weight: normal;text-decoration: none;">LTS</a>) version of Node.js: 12.<br>
<br>
If your <span style="color:#cc00ff; font-family:menlo,monaco,lucida console,liberation mono,dejavu sans mono,bitstream vera sans mono,courier new,monospace; font-size:14px"><code>package.json</code></span> file contains&nbsp; <span style="color:#cc00ff; font-family:menlo,monaco,lucida console,liberation mono,dejavu sans mono,bitstream vera sans mono,courier new,monospace; font-size:14px"><code>"engines": { "node": "8.10.x" }</code></span>, it will fail to build and print an error message explaining you must use 12.x instead.<br>
<br>
&nbsp;
<h3 style="display: block;margin: 0;padding: 0;color: #202020;font-family: Helvetica;font-size: 20px;font-style: normal;font-weight: bold;line-height: 125%;letter-spacing: normal;text-align: left;">What Should You Do?</h3>
<br>
To avoid your project from ceasing to work, we recommend configuring the most recent Node.js version (12) in your <span style="color:#cc00ff; font-family:menlo,monaco,lucida console,liberation mono,dejavu sans mono,bitstream vera sans mono,courier new,monospace; font-size:14px"><code>package.json</code></span> file.<br>
<br>
To do so, you only need add the <span style="color:#cc00ff; font-family:menlo,monaco,lucida console,liberation mono,dejavu sans mono,bitstream vera sans mono,courier new,monospace; font-size:14px"><code>"engines": { "node": "12.x" }</code></span> property and create a new <a href="https://zeit.us12.list-manage.com/track/click?u=3c9e9e13d7e6dae8faf375bed&id=6309ae0eb3&e=c9edb6a9f6" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #067df7;font-weight: normal;text-decoration: none;">Production Deployment</a>.<br>
<br>
Learn more about how to set a custom Node.js version <a href="https://zeit.us12.list-manage.com/track/click?u=3c9e9e13d7e6dae8faf375bed&id=96958079cf&e=c9edb6a9f6" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #067df7;font-weight: normal;text-decoration: none;">in our documentation</a>.<br>
<br>
<style type="text/css">.email-image {
max-width: 550px;
}
    @media only screen and (max-width: 480px){
        .email-image{
            height:auto !important;
            max-width:550px !important;
            width: 100% !important;
        }
    }
</style>

                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->

				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>

                        <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px;color: #000000;font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, Verdana, sans-serif;font-size: 14px;line-height: 150%;text-align: left;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;">

                            –<br>
<a href="https://zeit.us12.list-manage.com/track/click?u=3c9e9e13d7e6dae8faf375bed&id=8a02a06799&e=c9edb6a9f6" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #067df7;font-weight: normal;text-decoration: none;">Leo Lamprecht</a><br>
Head of Product<br>
ZEIT, Inc.
<style type="text/css">#bodyCell { padding-left: 0 !important; padding-right: 0 !important; }
</style>

                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->

				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table></td>
                            </tr>
                            <tr>
                                <td valign="top" id="templateFooter" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;border-top: 0;border-bottom: 0;"></td>
                            </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                        <!-- // END TEMPLATE -->
                    </td>
                </tr>
            </table>
        </center>
                <center>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <table border="0" cellpadding="0" cellspacing="0" width="100%" id="canspamBarWrapper" style="background-color:#FFFFFF; border-top:1px solid #E5E5E5;">
                    <tr>
                        <td align="center" valign="top" style="padding-top:20px; padding-bottom:20px;">
                            <table border="0" cellpadding="0" cellspacing="0" id="canspamBar">
                                <tr>
                                    <td align="center" valign="top" style="color:#606060; font-family:Helvetica, Arial, sans-serif; font-size:11px; line-height:150%; padding-right:20px; padding-bottom:5px; padding-left:20px; text-align:center;">
                                        This email was sent to <a href="mailto:###@###.com" target="_blank" style="color:#404040 !important;">###@###.com</a>
                                        <br />
                                        <a href="https://zeit.us12.list-manage.com/about" target="_blank" style="color:#404040 !important;"><em>why did I get this?</em></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://zeit.us12.list-manage.com/unsubscribe" style="color:#404040 !important;">unsubscribe from this list</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://zeit.us12.list-manage.com/profile" style="color:#404040 !important;">update subscription preferences</a>
                                        <br />
                                        ▲ZEIT &middot; 1046 Kearny St &middot; San Francisco, CA 94133 &middot; USA
                                        <br />
                                        <br />

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <style type="text/css">
                    @media only screen and (max-width: 480px){
                        table#canspamBar td{font-size:14px !important;}
                        table#canspamBar td a{display:block !important; margin-top:10px !important;}
                    }
                </style>
            </center><img src="https://zeit.us12.list-manage.com/track/open.php?u=3c9e9e13d7e6dae8faf375bed&id=ce66ec2f9f&e=c9edb6a9f6" height="1" width="1"></body>
</html>`;
