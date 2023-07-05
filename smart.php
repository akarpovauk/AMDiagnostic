<?php 

$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$text = $_POST['text'];

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

// $mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers  'smtp.gmail.com"
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'from.amds@gmail.com';                 // Наш логин
// $mail->Password = 'hiDMymSZg2UDG5x82FND';                           // Наш пароль от ящика
$mail->Password = 'pdnt gyej vysx vsvi';                           // Наш пароль от ящика

$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                    // TCP port to connect to
 
$mail->setFrom('from.amds@gmail.com', 'AMDS');   // От кого письмо 
$mail->addAddress('orders@akarpova.ru');     // Add a recipient
//$mail->addAddress('ellen@example.com');               // Name is optional
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');
//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'AMDS Message';
$mail->Body    = '
	Enquiry from AM Diagnostic Services Website: <br> <br>
	Name: ' . $name . ' <br>
	Subject: ' . $subject . '<br>
	E-mail: ' . $email . '<br>
	Text: ' . $text . '';

if(!$mail->send()) {
    return false;
} else {
    return true;
}

?>