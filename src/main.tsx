import './createPost.js';

import { Devvit, RedditAPIClient, useState } from '@devvit/public-api';

// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage =
  | {
      type: 'initialData';
      data: { username: string; currentCounter: number };
    }
  | {
      type: 'setCounter';
      data: { newCounter: number };
    }
  | {
      type: 'updateCounter';
      data: { currentCounter: number };
    };

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Picture puzzle',
  height: 'tall',
  render: (context) => {

    // Create a reactive state for web view visibility
    const [webviewVisible, setWebviewVisible] = useState(false);
    const [imageURL, setImageURL] = useState(null);

    const [postData] = useState(async () => {
      const subreddit = await context.reddit.getCurrentSubreddit();
      const posts = await context.reddit.getHotPosts({
        subredditName: subreddit.name,
        timeframe:"week",
        limit: 10,
        pageSize: 10
        
      });
      const allPosts = await posts.all();
      const postsWithImages = allPosts.filter(post => 
        post.thumbnail && post.thumbnail.url
      );

      if(postsWithImages.length>0) {
        const randomPost = postsWithImages[Math.floor(Math.random()*postsWithImages.length)];
        let imageURL = randomPost.body;
        
        console.log("\n" + imageURL);
        context.ui.webView.postMessage("myWebView", {
          data: imageURL
        });
        
      } else {
        console.log("No image found");
        
      }
      return imageURL;
    });

    

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack
          grow={!webviewVisible}
          height={webviewVisible ? '0%' : '100%'}
          alignment="middle center"
        >
          <text size="xlarge" weight="bold">
            Picture puzzle
          </text>
          <text>

          </text>
          <spacer />
          <button onPress={()=>{            
            setWebviewVisible(true)
          }}>Launch App</button>
        </vstack>
        <vstack grow={webviewVisible} height={webviewVisible ? '100%' : '0%'}>
          <vstack height={webviewVisible ? '100%' : '0%'}>
            <webview
              id="myWebView"
              url="page.html"
              grow
              height={webviewVisible ? '100%' : '0%'}
            />
          </vstack>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
