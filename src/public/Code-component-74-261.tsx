<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribe - Herman Kwayu</title>
    <script>
        // Redirect old unsubscribe URLs to the new format
        window.onload = function() {
            const params = new URLSearchParams(window.location.search);
            const email = params.get('email');
            const id = params.get('id');
            
            if (email) {
                // Construct new URL with unsubscribe parameter
                let newUrl = '/?unsubscribe=true&email=' + encodeURIComponent(email);
                if (id) {
                    newUrl += '&id=' + encodeURIComponent(id);
                }
                
                // Redirect to main site with new parameters
                window.location.href = newUrl;
            } else {
                // No email parameter, just go to main site
                window.location.href = '/';
            }
        };
    </script>
</head>
<body>
    <p>Redirecting to unsubscribe page...</p>
</body>
</html>