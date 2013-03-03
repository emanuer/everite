<?php

    // Include our configuration settings
    require_once 'config.php';

    // Include our OAuth functions
    require_once 'functions.php';


    // Use a session to keep track of temporary credentials, etc
    session_start();

    // Status variables
    $lastError = null;
    $currentStatus = null;

    // Request dispatching. If a function fails, $lastError will be updated.
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        if ($action == 'callback') {
            if (handleCallback()) {
                if (getTokenCredentials()) {
                    listNotebooks();
                }
            }
        } elseif ($action == 'authorize') {
            if (getTemporaryCredentials()) {
                // We obtained temporary credentials, now redirect the user to evernote.com to authorize access
                header('Location: ' . getAuthorizationUrl());
            }
        } elseif ($action == 'reset') {
            resetSession();
        }
    }
?>

<html>
    <head>
        <title>AlwaysRite</title>
    </head>
    <body>
        <h1>AlwaysRite</h1>
        <hr/>
        <h2>Evernote Authentication</h2>

<?php if (isset($lastError)) { ?>
        <p style="color:red">An error occurred: <?php echo htmlspecialchars($lastError);  ?></p>
<?php } elseif ($action != 'callback') { ?>

        <p>
            <a href="index.php?action=authorize">Authorize AlwaysRite to access your Evernote account</a>.
        </p>

<?php } else { ?>
        <p style="color:green">
            Congratulations, you have successfully authorized this application to access your Evernote account!
        </p>

        <p>
            You account contains the following notebooks:
        </p>

    <?php if (isset($_SESSION['notebooks'])) { ?>
        <ul>
        <?php foreach ($_SESSION['notebooks'] as $notebook) { ?>
            <li><?php echo htmlspecialchars($notebook); ?></li>
        <?php } ?>
        </ul>

    <?php } // if (isset($_SESSION['notebooks'])) ?> 

<?php } // if (isset($lastError)) ?>

        <hr/>

        <p>
            <a href="index.php?action=reset">Log out</a>.
        </p>

    </body>
</html>
