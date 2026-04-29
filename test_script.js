
    document.addEventListener('DOMContentLoaded', () => {
      const readMoreButtons = document.querySelectorAll('.read-more');
      const panel = document.getElementById('detailsPanel');
      const closePanel = document.getElementById('closePanel');
      
      const panelSubtitle = document.getElementById('panelSubtitle');
      const panelTitle = document.getElementById('panelTitle');
      const panelDescription = document.getElementById('panelDescription');

      readMoreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const planetName = button.getAttribute('data-planet');
          
          // Show loading state
          panelSubtitle.textContent = planetName;
          panelTitle.textContent = "Loading...";
          panelDescription.innerHTML = '<div style="text-align: center; padding: 20px; color: #ccc;">Loading details...</div>';
          panel.classList.add('active');
          closePanel.classList.add('active');

          fetch(`https://sriudhai.github.io/mercury.text/${planetName.toUpperCase()}`)
            .then(res => res.text())
            .then(html => {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = html;
              
              const links = tempDiv.querySelectorAll('a');
              links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && (href.match(/\.(jpeg|jpg|gif|png)$/i) || href.includes('i.ibb.co'))) {
                  const img = document.createElement('img');
                  img.src = href;
                  img.style.width = '100%';
                  img.style.borderRadius = '8px';
                  img.style.margin = '15px 0';
                  img.style.border = '1px solid rgba(255,255,255,0.1)';
                  img.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
                  
                  let parent = link.parentElement;
                  while (parent && parent.tagName !== 'P' && parent !== tempDiv) {
                    parent = parent.parentElement;
                  }
                  
                  if (parent && parent.tagName === 'P' && parent.textContent.includes('OUTER SURFACE')) {
                    parent.replaceWith(img);
                  } else {
                    link.replaceWith(img);
                  }
                }
              });

              let finalHtml = tempDiv.innerHTML;
              finalHtml = finalHtml.replace(/{[\s\S]*?<strong>.*?<\/strong><\/p>/, '');
              finalHtml = finalHtml.replace(/}<\/span><\/p>[\s\n]*$/, '</p>');
              finalHtml = finalHtml.replace(/<p><span[^>]*>&nbsp;<\/span><\/p>/g, '');
              finalHtml = finalHtml.replace(/<p><strong>.*?<\/strong><\/p>/, '');
              finalHtml = finalHtml.replace(/<p><span[^>]*>&nbsp;<\/span><strong>.*?<\/strong><\/p>/, '');
              
              panelTitle.textContent = "Planet Details";
              panelDescription.innerHTML = finalHtml;
            })
            .catch(err => {
              console.error("Failed to fetch planet HTML:", err);
              panelTitle.textContent = "Error";
              panelDescription.innerHTML = '<p style="color: #ff4444;">Failed to load planet details. Please try again later.</p>';
            });
        });
      });

      closePanel.addEventListener('click', () => {
        panel.classList.remove('active');
        closePanel.classList.remove('active');
      });
    });
  